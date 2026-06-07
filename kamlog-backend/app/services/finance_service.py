# app/services/finance_service.py  Calcul Encours K-Finance
from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.finance import Facture, Encaissement, StatutFacture
from app.models.tiers import Tiers


TVA_CAMEROUN = Decimal('0.1925')   # 19.25%  JAMAIS float


async def calculer_encours_client(
    db: AsyncSession,
    tiers_id: int,
) -> dict:
    """
    Calcule l'encours en temps réel pour un client.
    Encours = Somme(factures non soldées) - Somme(encaissements)
    """
    # Total factures émises non soldées
    factures_result = await db.execute(
        select(func.sum(Facture.montant_ttc_xaf)).where(
            Facture.tiers_id == tiers_id,
            Facture.statut.in_([
                StatutFacture.EMISE,
                StatutFacture.PARTIELLEMENT_PAYEE,
            ])
        )
    )
    total_factures = factures_result.scalar_one() or Decimal('0')

    # Total encaissements reçus (non lettrés)
    encaissements_result = await db.execute(
        select(func.sum(Encaissement.montant_xaf)).where(
            Encaissement.tiers_id == tiers_id,
            Encaissement.lettree == False,
        )
    )
    total_encaissements = encaissements_result.scalar_one() or Decimal('0')

    encours_xaf = total_factures - total_encaissements

    # Récupérer la limite crédit du tiers
    tiers = await db.get(Tiers, tiers_id)
    limite = Decimal(str(tiers.limite_credit_xaf)) if tiers else Decimal('0')

    return {
        "tiers_id": tiers_id,
        "encours_xaf": encours_xaf,
        "limite_credit_xaf": limite,
        "taux_occupation": (encours_xaf / limite * 100) if limite > 0 else None,
        "alerte": encours_xaf >= limite * Decimal("0.9"),
        "bloque": encours_xaf >= limite,
    }


async def verifier_limite_credit(
    db: AsyncSession, tiers_id: int, montant_new_facture: Decimal
) -> None:
    """Lève HTTP 402 si le nouvel encours dépasse la limite."""
    encours = await calculer_encours_client(db, tiers_id)
    nouvel_encours = encours['encours_xaf'] + montant_new_facture
    if encours['limite_credit_xaf'] > 0 and nouvel_encours > encours['limite_credit_xaf']:
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            f"Limite crédit dépassée : encours {nouvel_encours:,.0f} XAF"
            f" > limite {encours['limite_credit_xaf']:,.0f} XAF"
        )


def calculer_tva(montant_ht: Decimal) -> dict:
    """Calcule les montants HT, TVA 19.25%, TTC en XAF."""
    tva_xaf = (montant_ht * TVA_CAMEROUN).quantize(Decimal('1'))
    return {
        "montant_ht_xaf": montant_ht,
        "tva_xaf": tva_xaf,
        "montant_ttc_xaf": montant_ht + tva_xaf,
        "taux_tva": float(TVA_CAMEROUN * 100),
    }
