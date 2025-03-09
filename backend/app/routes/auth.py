# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import timedelta
from jose import jwt, JWTError
from ..auth import SECRET_KEY, ALGORITHM  



from ..database import SessionLocal
from ..crud import get_user_by_email, create_user
from ..schemas.user import UserCreate, UserResponse
from ..auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi import Response


router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Verify if user exists
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email already registered")
    return create_user(db, user)

@router.post("/login")
def login(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    print("Je débug")

    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect email or password")
    if not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, 
        expires_delta=access_token_expires
    )

    # Here i send the token with cookies
    response.set_cookie(
        key="token",   # The token is mapped with "token"
        value=access_token,
        httponly=True,  # Protect against the XSS attacks
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite='lax',  # Protect against CSRF attacks
        secure=False  # Pass it to true if you work in the prod
    )

    return {"Réussi connexion"}


# Here this endpoint is called every request to verify the token and the identity of the user
@router.get("/me", response_model=UserResponse)
def read_current_user(token: str = Cookie(None), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(
            status_code=401, detail="Non authentifié"
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=401, detail="Invalid authentication"
            )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# Just to logout
@router.post("/logout")
def logout(response: Response):
    """
    Déconnecte l'utilisateur en supprimant le token du cookie.
    """
    response.delete_cookie("token")  # We delete the token from cookies
    return {"message": "Déconnexion réussie"}