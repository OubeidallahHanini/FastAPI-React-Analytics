# app/routes/Metrics.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from sqlalchemy import text, func, desc, select, Table
from datetime import datetime, timedelta
from app.database import SessionLocal, engine
from app.database import engine, metadata, SessionLocal



router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/metricsOverMonth")
def get_metrics(db: Session = Depends(get_db)):
    """
    Calculates and returns key metrics from the "dynamic_sales" table.
    
    Metrics:
      - Total Monthly Sales (total sales per month)
      - Average Order Value (average value per order)
      - Top Product (product with the highest gross_sales)
    """
    # SQL query for MySQL using DATE_FORMAT
    query = text("""
        SELECT DATE_FORMAT(order_date, '%Y-%m') AS month,
               SUM(gross_sales) AS total_sales,
               AVG(gross_sales) AS avg_order_value,
               SUM(units_sold) AS total_units_sold,
               product_id
        FROM dynamic_sales
        GROUP BY month, product_id
        ORDER BY month
    """)

    # Execute the query using a connection (SQLAlchemy 2.0)
    with engine.connect() as conn:
        result = conn.execute(query)
        rows = result.fetchall()
    
    # Reconstruct monthly aggregates
    monthly_data = {}
    for row in rows:
        month = row._mapping["month"]
        product_id = row._mapping["product_id"]
        total_sales = row._mapping["total_sales"]
        avg_order = row._mapping["avg_order_value"]
        total_units = row._mapping["total_units_sold"]
        
        if month not in monthly_data:
            monthly_data[month] = {
                "total_sales": 0,
                "total_units_sold": 0,
                "orders": [],
                "product_sales": {}
            }
        monthly_data[month]["total_sales"] += total_sales
        monthly_data[month]["total_units_sold"] += total_units
        monthly_data[month]["orders"].append(avg_order)
        
        if product_id not in monthly_data[month]["product_sales"]:
            monthly_data[month]["product_sales"][product_id] = 0
        monthly_data[month]["product_sales"][product_id] += total_sales

    summary = []
    for month, data in monthly_data.items():
        overall_avg_order = (
            sum(data["orders"]) / len(data["orders"]) if data["orders"] else 0
        )
        top_product = max(data["product_sales"].items(), key=lambda x: x[1])[0] if data["product_sales"] else None
        summary.append({
            "month": month,
            "total_sales": data["total_sales"],
            "average_order_value": overall_avg_order,
            "total_units_sold": data["total_units_sold"],
            "top_product": top_product
        })

    summary = sorted(summary, key=lambda x: x["month"])
    return summary

@router.get("/top-products")
def get_top_products():
    with engine.connect() as conn:
        query = text("""
            SELECT product_id, COUNT(DISTINCT country) AS unique_customers, 
                   SUM(units_sold) AS total_sold, SUM(gross_sales) AS revenue
            FROM dynamic_sales
            GROUP BY product_id
            ORDER BY revenue DESC
            LIMIT 5
        """)
        result = conn.execute(query)
        products = [{"product": row._mapping["product_id"], 
                     "customers": row._mapping["unique_customers"],
                     "sales": row._mapping["total_sold"],
                     "revenue": row._mapping["revenue"]} for row in result]
    return products

@router.get("/top-sales-by-country-platform")
def get_top_sales_by_country_and_platform():
    """
    Get total gross_sales grouped by country and platform.
    Useful for identifying top performing combinations.
    """
    query = text("""
        SELECT country, platform, SUM(gross_sales) AS total_sales
        FROM dynamic_sales
        GROUP BY country, platform
        ORDER BY total_sales DESC
    """)

    with engine.connect() as conn:
        result = conn.execute(query)
        rows = result.fetchall()

    top_sales = [
        {
            "country": row._mapping["country"],
            "platform": row._mapping["platform"],
            "total_sales": row._mapping["total_sales"]
        }
        for row in rows
    ]

    return top_sales


@router.get("/advanced-key-metrics")
def get_advanced_key_metrics():
    session = SessionLocal()
    sales_table = Table("dynamic_sales", metadata, autoload_with=session.bind)

    today = datetime.now()
    first_day_this_month = today.replace(day=1)
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)
    yesterday = today - timedelta(days=1)

    try:
        # Total Sales
        total_sales = session.execute(select(func.sum(sales_table.c.gross_sales))).scalar() or 0

        # Average Order Value
        average_order_value = session.execute(
            select(func.avg(sales_table.c.gross_sales))
        ).scalar() or 0

        # Total Units Sold
        total_units_sold = session.execute(
            select(func.sum(sales_table.c.units_sold))
        ).scalar() or 0

        # Monthly Sales Growth %
        sales_this_month = session.execute(
            select(func.sum(sales_table.c.gross_sales))
            .where(sales_table.c.order_date >= first_day_this_month)
        ).scalar() or 0

        sales_last_month = session.execute(
            select(func.sum(sales_table.c.gross_sales))
            .where(sales_table.c.order_date >= first_day_last_month)
            .where(sales_table.c.order_date < first_day_this_month)
        ).scalar() or 1  # éviter division par 0

        monthly_sales_growth = ((sales_this_month - sales_last_month) / sales_last_month) * 100

        # Top Selling Product (units)
        top_selling_product = session.execute(
            select(sales_table.c.product_id, func.sum(sales_table.c.units_sold).label("total_units"))
            .group_by(sales_table.c.product_id)
            .order_by(desc("total_units"))
            .limit(1)
        ).first()

        # Top Grossing Product (sales)
        top_grossing_product = session.execute(
            select(sales_table.c.product_id, func.sum(sales_table.c.gross_sales).label("total_sales"))
            .group_by(sales_table.c.product_id)
            .order_by(desc("total_sales"))
            .limit(1)
        ).first()

        # Top Country by Sales
        top_country = session.execute(
            select(sales_table.c.country, func.sum(sales_table.c.gross_sales).label("country_sales"))
            .group_by(sales_table.c.country)
            .order_by(desc("country_sales"))
            .limit(1)
        ).first()

        # Number of Countries Sold To
        number_of_countries = session.execute(
            select(func.count(func.distinct(sales_table.c.country)))
        ).scalar() or 0

        # Top Selling Platform
        top_platform = session.execute(
            select(sales_table.c.platform, func.sum(sales_table.c.gross_sales).label("platform_sales"))
            .group_by(sales_table.c.platform)
            .order_by(desc("platform_sales"))
            .limit(1)
        ).first()

        return {
            "total_sales": round(total_sales, 2),
            "average_order_value": round(average_order_value, 2),
            "total_units_sold": total_units_sold,
            "monthly_sales_growth_pct": round(monthly_sales_growth, 2),
            "top_selling_product": top_selling_product.product_id if top_selling_product else None,
            "top_grossing_product": top_grossing_product.product_id if top_grossing_product else None,
            "top_country_by_sales": top_country.country if top_country else None,
            "number_of_countries_sold_to": number_of_countries,
            "top_selling_platform": top_platform.platform if top_platform else None
        }

    finally:
        session.close()

