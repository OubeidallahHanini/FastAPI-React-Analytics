from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .models.user import User
from .schemas.user import UserCreate  # Make sure you have defined this schema in app/schemas/user.py

# Initialize the bcrypt hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    """
    Retrieves a user by their email.
    """
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    """
    Creates a new user by hashing the password.
    """
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        # If the UserCreate schema contains a "role" attribute, it is used, otherwise the default value "user" is applied.
        role=user.role  # Using the field from the schema
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    """
    Retrieves a user by their ID.
    """
    return db.query(User).filter(User.id == user_id).first()

def update_user(db: Session, user_id: int, updated_data: dict):
    """
    Updates a user's information.
    
    `updated_data` is a dictionary containing the fields to update.
    For example: {"email": "new_email@example.com", "is_active": False}
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    for key, value in updated_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """
    Deletes a user from the database.
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user