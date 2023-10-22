from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Node


async def get_nodes(db: AsyncSession) -> Optional[List[Node]]:
    nodes = await db.execute(select(Node))
    return nodes.scalars().all()


async def create_node(name: str, db: AsyncSession) -> Node:
    node = Node(name=name)

    db.add(node)
    await db.commit()
    await db.refresh(node)

    return node
