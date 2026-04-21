import uuid

from sqlmodel import Field, SQLModel


class StationBase(SQLModel):
    name: str = Field(index=True, max_length=255)


# Database model
class Station(StationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


# Properties to return via API, id is always required
class StationPublic(StationBase):
    id: uuid.UUID


# Properties to receive via API on creation
class StationCreate(StationBase):
    pass


# Properties to receive via API on update, all are optional
class StationUpdate(StationBase):
    pass


class StationsPublic(SQLModel):
    data: list[StationPublic]
    count: int
