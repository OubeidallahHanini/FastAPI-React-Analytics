# app/routes/generic.py

from fastapi import APIRouter, Query, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import engine
from typing import List, Dict, Any
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/sales", response_model=List[Dict[str, Any]])
def get_generic_sales(
    start_date: str = Query(None, description="Start date in the format YYYY-MM-DD"),
    end_date: str = Query(None, description="End date in the format YYYY-MM-DD"),
    platform: str = Query(None, description="Platform name (e.g., Amazon)")
):

    # Build the base SQL query
    query = "SELECT * FROM dynamic_sales"
    filters = []
    params = {}

    # Add filters if provided in the URL
    if start_date:
        filters.append("order_date >= :start_date")
        params["start_date"] = start_date  # Adjust if order_date is in datetime format.
    if end_date:
        filters.append("order_date <= :end_date")
        params["end_date"] = end_date
    if platform:
        filters.append("platform = :platform")
        params["platform"] = platform

    # If filters exist, add them to the query
    if filters:
        query += " WHERE " + " AND ".join(filters)

    # Execute the query
    with engine.connect() as conn:
        result = conn.execute(text(query), params)
        rows = result.fetchall()
        # Convert each row to a dictionary
        result_list = [dict(row._mapping) for row in rows]

    return result_list

@router.get("/summary", response_model=List[Dict[str, Any]])
def get_sales_summary(db: Session = Depends(get_db)):
  
    query = text("""
        SELECT DATE_FORMAT(order_date, '%Y-%m') AS month,
               SUM(gross_sales) AS total_gross_sales,
               SUM(units_sold) AS total_units_sold
        FROM dynamic_sales
        GROUP BY DATE_FORMAT(order_date, '%Y-%m')
        ORDER BY month
    """)
    result = db.execute(query)
    rows = result.fetchall()
    # Convert each row to a dictionary
    summary = [dict(row._mapping) for row in rows]
    return summary



@router.get("/sales-by-platform")
def get_sales_by_platform():
    with engine.connect() as conn:
        query = text("""
            SELECT platform, SUM(gross_sales) AS total_sales
            FROM dynamic_sales
            GROUP BY platform
        """)
        result = conn.execute(query)
        sales_data = [{"platform": row._mapping["platform"], "total_sales": row._mapping["total_sales"]} for row in result]
    
    return sales_data

@router.get("/sales-by-country")
def get_sales_by_country():
    with engine.connect() as conn:
        query = text("""
            SELECT country, SUM(gross_sales) AS total_sales
            FROM dynamic_sales
            GROUP BY country
            ORDER BY total_sales DESC
            LIMIT 5
        """)
        result = conn.execute(query)
        sales_data = [{"country": row._mapping["country"], "total_sales": row._mapping["total_sales"]} for row in result]
    return sales_data