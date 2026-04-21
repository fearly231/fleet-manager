import uuid

# --- SQLAlchemy (Modele Bazy Danych) ---
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# --- Pydantic (Schematy / Walidacja API) ---
from pydantic import BaseModel, ConfigDict, Field


# 1. Deklaratywna baza dla SQLAlchemy
class Base(DeclarativeBase):
    pass


# Database model (SQLAlchemy)
class Worker(Base):
    __tablename__ = "worker"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), index=True)


# ==========================================
# 2. Schematy API (Pydantic)
# ==========================================

class WorkerBase(BaseModel):
    name: str = Field(max_length=255)


# Properties to receive via API on creation
class WorkerCreate(WorkerBase):
    pass


# Properties to receive via API on update, all are optional
class WorkerUpdate(BaseModel):
    # W czystym Pydanticu, aby pole było opcjonalne (w przeciwieństwie do wymaganego w Base),
    # zazwyczaj nadpisujemy je z type hintem `str | None` i domyślną wartością `None`.
    name: str | None = Field(default=None, max_length=255)


# Properties to return via API, id is always required
class WorkerPublic(WorkerBase):
    id: uuid.UUID

    # Kluczowe ustawienie w Pydantic V2: pozwala schematowi "zrozumieć" 
    # obiekt ORM z SQLAlchemy (zastępuje dawne `orm_mode = True`)
    model_config = ConfigDict(from_attributes=True)


class WorkersPublic(BaseModel):
    data: list[WorkerPublic]
    count: int