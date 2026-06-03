# app/services/parc_service.py — Logique Métier K-Parc
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.models.parc import (
    EmplacementParc, StockPhysiqueParc, MouvementParc,
    StatutEmplacement
)
from app.schemas.parc import GateInRequest, GateOutRequest


async def process_gate_in(
    db: AsyncSession,
    data: GateInRequest,
    operateur_id: int,
) -> dict:
    """
    Traite l'entrée d'un conteneur (Gate In).
    Règles : emplacement doit être LIBRE.
    """
    # Vérifier que l'emplacement existe et est libre
    emplacement = await db.get(EmplacementParc, data.emplacement_id)
    if not emplacement:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Emplacement introuvable")
    
    if emplacement.statut != StatutEmplacement.LIBRE:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Emplacement non libre : statut {emplacement.statut}"
        )
    
    # Vérifier que le conteneur n'est pas déjà dans le parc
    existing_stock = await db.execute(
        select(StockPhysiqueParc).where(
            StockPhysiqueParc.numero_conteneur == data.numero_conteneur,
            StockPhysiqueParc.date_gate_out.is_(None)
        )
    )
    if existing_stock.scalar_one_or_none():
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Conteneur déjà présent dans le parc"
        )
    
    # Créer le stock physique
    stock = StockPhysiqueParc(
        numero_conteneur=data.numero_conteneur,
        emplacement_id=data.emplacement_id,
        type_conteneur=data.type_conteneur,
        etat=data.etat,
        poids_tare_kg=data.poids_tare_kg,
        date_gate_in=datetime.utcnow(),
    )
    db.add(stock)
    await db.flush()  # Pour obtenir l'ID du stock
    
    # Marquer l'emplacement comme OCCUPE
    emplacement.statut = StatutEmplacement.OCCUPE
    
    # Créer le mouvement
    mouvement = MouvementParc(
        reference=f"GIN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        conteneur_id=stock.id,
        type_mouvement="GATE_IN",
        emplacement_dest_id=data.emplacement_id,
        date_mouvement=datetime.utcnow(),
        operateur_id=operateur_id,
    )
    db.add(mouvement)
    
    await db.commit()
    await db.refresh(stock)
    
    return {
        "message": "Gate In réussi",
        "conteneur": stock.numero_conteneur,
        "emplacement": emplacement.code_emplacement,
    }


async def process_gate_out(
    db: AsyncSession,
    data: GateOutRequest,
    operateur_id: int,
) -> dict:
    """
    Traite la sortie d'un conteneur (Gate Out).
    Règles : conteneur doit être présent dans le parc.
    """
    # Trouver le conteneur
    stock_result = await db.execute(
        select(StockPhysiqueParc).where(
            StockPhysiqueParc.numero_conteneur == data.numero_conteneur,
            StockPhysiqueParc.date_gate_out.is_(None)
        )
    )
    stock = stock_result.scalar_one_or_none()
    
    if not stock:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Conteneur non trouvé dans le parc"
        )
    
    # Marquer la sortie
    stock.date_gate_out = datetime.utcnow()
    
    # Libérer l'emplacement
    emplacement = await db.get(EmplacementParc, stock.emplacement_id)
    emplacement.statut = StatutEmplacement.LIBRE
    
    # Créer le mouvement
    mouvement = MouvementParc(
        reference=f"GOUT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        conteneur_id=stock.id,
        type_mouvement="GATE_OUT",
        emplacement_source_id=stock.emplacement_id,
        date_mouvement=datetime.utcnow(),
        operateur_id=operateur_id,
    )
    db.add(mouvement)
    
    await db.commit()
    
    return {
        "message": "Gate Out réussi",
        "conteneur": stock.numero_conteneur,
        "emplacement": emplacement.code_emplacement,
    }
