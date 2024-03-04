import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

db_username = os.getenv("db_username")
db_password = os.getenv("db_password")
db_host = os.getenv("db_host")

SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{db_username}:{db_password}@{db_host}:5432/aitutour?sslmode=require"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
