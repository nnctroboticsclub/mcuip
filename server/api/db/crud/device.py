from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Device


async def get_devices(db: AsyncSession) -> Optional[List[Device]]:
    nodes = await db.execute(select(Device))
    return nodes.scalars().all()


async def create_device(name: str, node_id: int, db: AsyncSession) -> Device:
    device = Device(name=name)
    device.node_id = node_id

    db.add(device)
    await db.commit()
    await db.refresh(device)

    return device
