from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import Tender, User
from routes.auth import get_current_user
from services.bid_pack_service import generate_bid_pack

router = APIRouter(prefix="/api/bidpack", tags=["Bid Pack"])

@router.post("/{tender_id}")
async def create_bid_pack(tender_id: str, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    tender = await db.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    try:
        pdf_bytes, pages = await generate_bid_pack(tender)
        filename = f"Velani_Bid_Pack_{tender.external_id or tender_id}.pdf"
        return StreamingResponse(pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{filename}"', "X-Pages": str(pages)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
