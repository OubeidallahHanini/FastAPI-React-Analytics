import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from os.path import dirname, join
from sqlalchemy import MetaData


# Loading the .env variables
load_dotenv()

# Get my environments
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD", "your_password")
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "sayano")

# print("DEBUG:", DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME) 



# Build the MySQL connection URL
# DATABASE_URL = "mysql+pymysql://root:abdou123@localhost:3306/sayano"
DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured session for interacting with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the base for SQLAlchemy models
Base = declarative_base()

metadata = MetaData()

