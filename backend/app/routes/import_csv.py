import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from sqlalchemy import Table, Column, Integer, String, Float, DateTime, MetaData, inspect
from sqlalchemy.exc import SQLAlchemyError
from app.database import engine
import csv

router = APIRouter()

# Determines the most appropriate SQLAlchemy column type based on the column name and a sample value from the CSV file.
def infer_column_type(col_name: str, sample_value: str):
    if "date" in col_name.lower():
        return DateTime
    try:
        int(sample_value)
        return Integer
    except (ValueError, TypeError):
        pass
    try:
        float(sample_value)
        return Float
    except (ValueError, TypeError):
        pass
    return String(255)

# Parses CSV content, infers column types, and dynamically generates a SQLAlchemy table schema.
def create_table_from_csv_content(csv_content: str, table_name: str, metadata: MetaData):
    reader = csv.DictReader(csv_content.splitlines())
    fieldnames = reader.fieldnames
    if not fieldnames:
        raise ValueError("The CSV does not contain a header.")

    try:
        first_row = next(reader)
    except StopIteration:
        raise ValueError("The CSV is empty.")

    columns = [Column("id", Integer, primary_key=True, autoincrement=True)]
    for field in fieldnames:
        sample_value = first_row.get(field)
        col_type = infer_column_type(field, sample_value)
        columns.append(Column(field, col_type, nullable=False))

    dynamic_table = Table(table_name, metadata, *columns)
    return dynamic_table, first_row, reader


# Our API to Handles CSV file upload, creates a database table based on its content, and inserts the data into the table automatically.
@router.post("/import-csv")
async def import_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="The format should be CSV")

    content = await file.read()
    try:
        content_str = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Can't decode the file into UTF-8")

    table_name = "dynamic_sales"
    metadata = MetaData()

    try:
        # Open One connection ( like the Singleton same idea)
        with engine.begin() as connection:
            inspector = inspect(connection)
            
            # Delete the table if it exists
            if inspector.has_table(table_name):
                existing_table = Table(table_name, metadata, autoload_with=connection)
                existing_table.drop(connection)

            # Create the table according to the CSV file
            dynamic_table, first_row, reader = create_table_from_csv_content(content_str, table_name, metadata)
            
            # Create effectively the table in the db 
            metadata.create_all(connection)

            # Inserting the data 
            rows = [first_row] + list(reader)
            connection.execute(dynamic_table.insert(), rows)

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQLAlchemy : {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur générale : {e}")

    return {"message": f"The table '{table_name}' was successfully created and populated."}