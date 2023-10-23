from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .base import Base


class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(128), nullable=False)
