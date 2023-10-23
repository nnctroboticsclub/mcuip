import fastapi
from fastapi import Depends, UploadFile

from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_db
from .db.models import Node

from .db.crud.node import get_nodes, create_node

app = fastapi.FastAPI()


@app.get("/api/nodes")
async def api_get_nodes(db: AsyncSession = Depends(get_db)):
    nodes = await get_nodes(db)
    return [{"id": node.id, "name": node.name} for node in nodes]


@app.post("/api/node")
async def register_node(node_name: str, db: AsyncSession = Depends(get_db)):
    node = await create_node(node_name, db)
    return {"id": node.id, "name": node.name}


@app.post("/api/upload_flash")
async def upload_flash(device_id: str, file: UploadFile, db: AsyncSession = Depends(get_db)):
    pass
