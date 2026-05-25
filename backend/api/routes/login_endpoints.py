from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api import deps
from core import security
from crud import worker_crud
from database.database import get_db
from models.worker_model import WorkerPublic, WorkerCreate, Worker

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/access-token")
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = worker_crud.get_worker_by_email(session=db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=WorkerPublic)
def register_user(
    *,
    db: Session = Depends(get_db),
    worker_in: WorkerCreate,
):
    """
    Create new user.
    """
    user = worker_crud.get_worker_by_email(session=db, email=worker_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    return worker_crud.create_worker(session=db, worker_in=worker_in)

@router.get("/users/me", response_model=WorkerPublic)
def read_user_me(
    current_user: Worker = Depends(deps.get_current_user),
):
    """
    Get current user.
    """
    return current_user
