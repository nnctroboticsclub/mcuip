import fastapi
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_db
from .db.models import Node, Device

from .db.crud.node import get_nodes, create_node
from .db.crud.device import get_devices, create_device

app = fastapi.FastAPI()


@app.get("/api/nodes")
async def api_get_nodes(db: AsyncSession = Depends(get_db)):
    nodes = await get_nodes(db)
    return [{"id": node.id, "name": node.name} for node in nodes]


@app.post("/api/node")
async def register_node(node_name: str, db: AsyncSession = Depends(get_db)):
    node = await create_node(node_name, db)
    return {"id": node.id, "name": node.name}


@app.get("/api/devices")
async def api_get_devices(db: AsyncSession = Depends(get_db)):
    devices = await get_devices(db)
    return [{"id": device.id, "name": device.name, "node_id": device.node_id} for device in devices]


@app.post("/api/device")
async def register_device(node_id: str, name: str, db: AsyncSession = Depends(get_db)):
    try:
        nid = int(node_id)
    except ValueError:
        raise fastapi.HTTPException(status_code=400, detail="Invalid node_id")

    node = await db.get(Node, nid)
    if node is None:
        raise fastapi.HTTPException(status_code=404, detail="Node not found")

    device = await create_device(name, nid, db)
    return {"id": device.id, "name": device.name, "node_id": device.node_id}
