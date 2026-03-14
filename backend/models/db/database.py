# database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

# ==========================================
# 1. PostgreSQL Connection (Neon)
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL")

# Create SQLAlchemy Engine
pg_engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create Session Local class for dependency injection
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

# Base class for your SQLAlchemy models (Users, Organizations, etc.)
Base = declarative_base()

# Dependency to get Postgres DB session in routes
def get_pg_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 2. MongoDB Connection (Atlas)
# ==========================================
MONGODB_URI = os.getenv("MONGODB_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "cyberimpact_db")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Connect to MongoDB on app startup"""
    mongodb.client = AsyncIOMotorClient(MONGODB_URI)
    mongodb.db = mongodb.client[MONGO_DB_NAME]
    print("✅ Connected to MongoDB Atlas")

async def close_mongo_connection():
    """Close MongoDB connection on app shutdown"""
    if mongodb.client:
        mongodb.client.close()
        print("🛑 Closed MongoDB connection")

# Dependency to get MongoDB database in routes
def get_mongo_db():
    return mongodb.db