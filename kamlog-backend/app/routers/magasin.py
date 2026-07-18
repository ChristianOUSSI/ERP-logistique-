# app/routers/magasin.py - Routes API pour le module K-magasin
from app.utils.rbac import require_role
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from slowapi import Limiter
from slowapi.util import get_remote_address
import json
from datetime import datetime, timedelta, timezone
from app.services.import_export_service import ImportExportService

from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.schemas.magasin import (
    Magasin, MagasinCreate, MagasinUpdate,
    ClientMagasin, ClientMagasinCreate, ClientMagasinUpdate,
    Article, ArticleCreate, ArticleUpdate,
    Declaration, DeclarationCreate, DeclarationUpdate,
    Reception, ReceptionCreate, ReceptionUpdate,
    Stock, StockCreate, StockUpdate, StockFilter,
    Commande, CommandeCreate, CommandeUpdate,
    BandeLivraison, BandeLivraisonCreate, BandeLivraisonUpdate,
    OrdreTransfert, OrdreTransfertCreate, OrdreTransfertUpdate
)
from app.services.magasin_service import (
    MagasinService, ClientMagasinService, ArticleService,
    DeclarationService, ReceptionService, StockService,
    CommandeService, BandeLivraisonService, OrdreTransfertService
)
from app.models.user import User

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["K-Magasin"])


@router.get("/kpis")
@check_permission("magasin:read")
def get_magasin_kpis(db: Session = Depends(get_db)):
    """Calcule les KPIs magasin côté serveur."""
    from sqlalchemy import func
    from app.models.magasin import Stock, Article, Magasin
    
    # Valeur totale du stock
    # On fait la jointure avec Article pour obtenir la valeur unitaire
    total_stock_value = db.query(func.sum(Stock.quantite_disponible * Article.valeur_unitaire)).join(Article).scalar() or 0
    
    # Taux d'occupation = total_stock / capacite_totale
    capacite_totale = db.query(func.sum(Magasin.capacite_max_m3)).scalar() or 1000.0
    stock_total = db.query(func.sum(Stock.quantite_disponible)).scalar() or 0
    occupation_rate = (stock_total / capacite_totale) * 100 if capacite_totale > 0 else 0
    
    low_stock_alerts = db.query(func.count(Stock.id)).filter(
        Stock.quantite_disponible < 50
    ).scalar() or 0
    
    # Active orders (Commandes non livrées ni annulées)
    from app.models.magasin import Commande, StatutCommande
    active_orders = db.query(func.count(Commande.id)).filter(
        Commande.statut.in_([StatutCommande.NOUVELLE, StatutCommande.EN_PREPARATION, StatutCommande.PRETE])
    ).scalar() or 0
    
    return {
        "totalStockValue": float(total_stock_value),
        "occupationRate": float(occupation_rate),
        "activeOrders": active_orders,
        "lowStockAlerts": low_stock_alerts
    }


# ============ MAGASINS ============
@router.get("/magasins", response_model=List[Magasin])
def get_magasins(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les magasins actifs"""
    return MagasinService.get_all_magasins(db, skip, limit)


@router.get("/magasins/{magasin_id}", response_model=Magasin)
def get_magasin(magasin_id: int, db: Session = Depends(get_db)):
    """Récupère un magasin par son ID"""
    magasin = MagasinService.get_magasin(db, magasin_id)
    if not magasin:
        raise HTTPException(status_code=404, detail="Magasin non trouvé")
    return magasin


@router.post("/magasins", response_model=Magasin)
    @require_role(["admin", "manager"])
@check_permission("magasin:create")
def create_magasin(magasin: MagasinCreate, db: Session = Depends(get_db)):
    """Crée un nouveau magasin"""
    return MagasinService.create_magasin(db, magasin)


@router.put("/magasins/{magasin_id}", response_model=Magasin)
    @require_role(["admin", "manager"])

@check_permission("magasin:update")
def update_magasin(magasin_id: int, magasin: MagasinUpdate, db: Session = Depends(get_db)):
    """Met à jour un magasin"""
    updated_magasin = MagasinService.update_magasin(db, magasin_id, magasin)
    if not updated_magasin:
        raise HTTPException(status_code=404, detail="Magasin non trouvé")
    return updated_magasin


@router.delete("/magasins/{magasin_id}")
    @require_role(["admin", "manager"])

@check_permission("magasin:delete")
def delete_magasin(magasin_id: int, db: Session = Depends(get_db)):
    """Supprime (désactive) un magasin"""
    success = MagasinService.delete_magasin(db, magasin_id)
    if not success:
        raise HTTPException(status_code=404, detail="Magasin non trouvé")
    return {"message": "Magasin désactivé avec succès"}


# ============ CLIENTS ============
@router.get("/clients", response_model=List[ClientMagasin])
def get_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les clients actifs"""
    return ClientMagasinService.get_all_clients(db, skip, limit)


@router.get("/clients/{client_id}", response_model=ClientMagasin)
def get_client(client_id: int, db: Session = Depends(get_db)):
    """Récupère un client par son ID"""
    client = ClientMagasinService.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return client


@router.post("/clients", response_model=ClientMagasin)
    @require_role(["admin", "manager"])

@check_permission("magasin:create")
def create_client(client: ClientMagasinCreate, db: Session = Depends(get_db)):
    """Crée un nouveau client"""
    return ClientMagasinService.create_client(db, client)


@router.put("/clients/{client_id}", response_model=ClientMagasin)
    @require_role(["admin", "manager"])

@check_permission("magasin:update")
def update_client(client_id: int, client: ClientMagasinUpdate, db: Session = Depends(get_db)):
    """Met à jour un client"""
    updated_client = ClientMagasinService.update_client(db, client_id, client)
    if not updated_client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return updated_client


@router.delete("/clients/{client_id}")
    @require_role(["admin", "manager"])

@check_permission("magasin:delete")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Supprime (désactive) un client"""
    success = ClientMagasinService.delete_client(db, client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return {"message": "Client désactivé avec succès"}


# ============ ARTICLES ============
@router.get("/articles", response_model=List[Article])
def get_articles(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Récupère tous les articles actifs"""
    if search:
        return ArticleService.search_articles(db, search)
    return ArticleService.get_all_articles(db, skip, limit)


@router.get("/articles/by-code/{code_article}", response_model=Article)
def get_article_by_code(code_article: str, db: Session = Depends(get_db)):
    """Récupère un article par son code d'article (auto-complétion)"""
    article = ArticleService.get_article_by_code(db, code_article)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return article


@router.get("/articles/{article_id}", response_model=Article)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Récupère un article par son ID"""
    article = ArticleService.get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return article


@router.post("/articles", response_model=Article)
    @require_role(["admin", "manager"])

@check_permission("article:create")
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """Crée un nouvel article avec génération automatique du code si non fourni"""
    return ArticleService.create_article(db, article)


@router.put("/articles/{article_id}", response_model=Article)
    @require_role(["admin", "manager"])

@check_permission("article:update")
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    """Met à jour un article"""
    updated_article = ArticleService.update_article(db, article_id, article)
    if not updated_article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return updated_article


@router.delete("/articles/{article_id}")
    @require_role(["admin", "manager"])

@check_permission("article:delete")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    """Supprime (désactive) un article"""
    success = ArticleService.delete_article(db, article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return {"message": "Article désactivé avec succès"}


# ============ DECLARATIONS (BILL OF LADING) ============
@router.get("/declarations", response_model=List[Declaration])
def get_declarations(
    skip: int = 0,
    limit: int = 100,
    client_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Récupère toutes les déclarations"""
    if client_id:
        return DeclarationService.get_declarations_by_client(db, client_id)
    return DeclarationService.get_all_declarations(db, skip, limit)


@router.get("/declarations/{declaration_id}", response_model=Declaration)
def get_declaration(declaration_id: int, db: Session = Depends(get_db)):
    """Récupère une déclaration par son ID"""
    declaration = DeclarationService.get_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return declaration


@router.get("/declarations/bl/{numero_bl}", response_model=Declaration)
def get_declaration_by_bl(numero_bl: str, db: Session = Depends(get_db)):
    """Récupère une déclaration par son numéro de BL"""
    declaration = DeclarationService.get_declaration_by_bl(db, numero_bl)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return declaration


@router.get("/declarations/{declaration_id}/receptions-summary")
def get_declaration_receptions_summary(declaration_id: int, db: Session = Depends(get_db)):
    """Récupère le résumé des réceptions (par magasin) pour une déclaration"""
    declaration = DeclarationService.get_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return DeclarationService.get_receptions_summary(db, declaration_id)

@router.post("/declarations", response_model=Declaration)
    @require_role(["admin", "manager"])

@check_permission("declaration:create")
def create_declaration(
    declaration: DeclarationCreate,
    cree_par: str = Query(..., description="Utilisateur qui crée la déclaration"),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle déclaration (Bill of Lading)"""
    return DeclarationService.create_declaration(db, declaration, cree_par)


@router.put("/declarations/{declaration_id}", response_model=Declaration)
    @require_role(["admin", "manager"])

@check_permission("declaration:update")
def update_declaration(declaration_id: int, declaration: DeclarationUpdate, db: Session = Depends(get_db)):
    """Met à jour une déclaration"""
    updated_declaration = DeclarationService.update_declaration(db, declaration_id, declaration)
    if not updated_declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return updated_declaration


@router.post("/declarations/{declaration_id}/valider", response_model=Declaration)
    @require_role(["admin", "manager"])

@check_permission("declaration:update")
def valider_declaration(declaration_id: int, db: Session = Depends(get_db)):
    """Valide une déclaration"""
    declaration = DeclarationService.valider_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return declaration


@router.post("/declarations/{declaration_id}/annuler", response_model=Declaration)
    @require_role(["admin", "manager"])

@check_permission("declaration:update")
def annuler_declaration(declaration_id: int, db: Session = Depends(get_db)):
    """Annule une déclaration"""
    declaration = DeclarationService.annuler_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return declaration


# Prédiction de timing de réception (IA)
@router.get("/predictions/reception-timing/{declaration_id}")
@check_permission("declaration:read")
def get_reception_timing_prediction(declaration_id: int, db: Session = Depends(get_db)):
    """Prédit la date de completion de la réception basée sur l'historique"""
    from sqlalchemy import func
    from app.models.magasin import Declaration, Reception, StatutReception

    declaration = DeclarationService.get_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")

    # Récupérer les receptions complètes pour cette déclaration
    receptions = db.query(Reception).filter(
        Reception.declaration_id == declaration_id,
        Reception.statut == StatutReception.COMPLETEE
    ).all()

    if not receptions:
        # Pas d'historique, retourner une estimation par défaut (7 jours)
        estimated_date = declaration.date_declaration + timedelta(days=7)
        return {
            "declaration_id": declaration_id,
            "estimated_completion_date": estimated_date.isoformat(),
            "based_on_history": False,
            "message": "Pas d'historique de réception pour cette déclaration, estimation par défaut de 7 jours"
        }

    # Calculer la durée moyenne entre la déclaration et la réception completion
    total_duration = 0
    count = 0
    for rec in receptions:
        if rec.date_reception and declaration.date_declaration:
            duration = rec.date_reception - declaration.date_declaration
            total_duration += duration.total_seconds()
            count += 1

    if count == 0:
        estimated_date = declaration.date_declaration + timedelta(days=7)
    else:
        avg_duration_seconds = total_duration / count
        estimated_date = declaration.date_declaration + timedelta(seconds=avg_duration_seconds)

    return {
        "declaration_id": declaration_id,
        "estimated_completion_date": estimated_date.isoformat(),
        "based_on_history": True,
        "average_reception_duration_seconds": avg_duration_seconds if count > 0 else None,
        "sample_size": count
    }


# Historique complet des réceptions pour un BL
@router.get("/declarations/{declaration_id}/receptions-history")
@check_permission("declaration:read")
def get_reception_history(declaration_id: int, db: Session = Depends(get_db)):
    """Récupère l'historique complet des réceptions pour un BL sur l'ensemble des magasins"""
    from app.models.magasin import Reception, LigneReception, Magasin, StatutReception, Article
    from sqlalchemy.orm import joinedload
    
    declaration = DeclarationService.get_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")

    # Récupérer toutes les réceptions associées à ce BL (tous magasins confondus)
    receptions = db.query(Reception).options(
        joinedload(Reception.magasin),
        joinedload(Reception.lignes).joinedload(LigneReception.article)
    ).filter(
        Reception.declaration_id == declaration_id,
        Reception.statut != StatutReception.ANNULEE
    ).order_by(Reception.date_reception.desc()).all()

    historique = []
    total_recu_par_article = {}

    for rec in receptions:
        for ligne in rec.lignes:
            art_code = ligne.article.code_article
            if art_code not in total_recu_par_article:
                total_recu_par_article[art_code] = 0
            total_recu_par_article[art_code] += float(ligne.quantite_recue)

            historique.append({
                "reception_id": rec.id,
                "numero_reception": rec.numero_reception,
                "date_reception": rec.date_reception,
                "magasin_id": rec.magasin_id,
                "magasin_nom": rec.magasin.nom if rec.magasin else "Inconnu",
                "article_code": art_code,
                "article_nom": ligne.article.nom,
                "quantite_recue": float(ligne.quantite_recue),
                "unite_mesure": ligne.unite_mesure.value,
                "numero_lot": ligne.numero_lot,
                "date_fabrication": ligne.date_fabrication,
                "date_expiration": ligne.date_expiration,
                "recu_par": rec.recu_par,
                "statut": rec.statut.value
            })

    return {
        "declaration_id": declaration_id,
        "numero_bl": declaration.numero_bl,
        "historique": historique,
        "total_recu_par_article": total_recu_par_article
    }


# ============ RECEPTIONS ============
@router.get("/receptions", response_model=List[Reception])
def get_receptions(
    skip: int = 0,
    limit: int = 100,
    declaration_id: Optional[int] = None,
    magasin_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Récupère toutes les réceptions"""
    if declaration_id:
        return ReceptionService.get_receptions_by_declaration(db, declaration_id)
    if magasin_id:
        return ReceptionService.get_receptions_by_magasin(db, magasin_id)
    return ReceptionService.get_all_receptions(db, skip, limit)


@router.get("/receptions/{reception_id}", response_model=Reception)
def get_reception(reception_id: int, db: Session = Depends(get_db)):
    """Récupère une réception par son ID"""
    reception = ReceptionService.get_reception(db, reception_id)
    if not reception:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    return reception


@router.post("/receptions", response_model=Reception)
    @require_role(["admin", "manager"])

@check_permission("reception:create")
def create_reception(
    reception: ReceptionCreate,
    recu_par: str = Query(..., description="Utilisateur qui reçoit"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle réception avec mise à jour automatique du stock"""
    return ReceptionService.create_reception(db, reception, recu_par, current_user.id)


@router.put("/receptions/{reception_id}", response_model=Reception)
    @require_role(["admin", "manager"])

@check_permission("reception:update")
def update_reception(reception_id: int, reception: ReceptionUpdate, db: Session = Depends(get_db)):
    """Met à jour une réception"""
    updated_reception = ReceptionService.update_reception(db, reception_id, reception)
    if not updated_reception:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    return updated_reception


@router.post("/receptions/{reception_id}/completer", response_model=Reception)
    @require_role(["admin", "manager"])

@check_permission("reception:update")
def completer_reception(reception_id: int, db: Session = Depends(get_db)):
    """Marque une réception comme complète"""
    reception = ReceptionService.completer_reception(db, reception_id)
    if not reception:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    return reception


@router.post("/receptions/{reception_id}/annuler", response_model=Reception)
    @require_role(["admin", "manager"])

@check_permission("reception:update")
def annuler_reception(reception_id: int, db: Session = Depends(get_db)):
    """Annule une réception et met à jour le stock"""
    reception = ReceptionService.annuler_reception(db, reception_id)
    if not reception:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    return reception


# ============ STOCKS ============
@router.get("/stocks", response_model=List[Stock])
def get_stocks(
    skip: int = 0,
    limit: int = 100,
    magasin_id: Optional[int] = None,
    article_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Récupère tous les stocks"""
    if magasin_id:
        return StockService.get_stocks_by_magasin(db, magasin_id)
    if article_id:
        return StockService.get_stocks_by_article(db, article_id)
    return StockService.get_all_stocks(db, skip, limit)


@router.get("/stocks/{magasin_id}/{article_id}", response_model=Stock)
def get_stock(magasin_id: int, article_id: int, db: Session = Depends(get_db)):
    """Récupère le stock pour un magasin et un article spécifiques"""
    stock = StockService.get_stock(db, magasin_id, article_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock non trouvé")
    return stock


@router.get("/stocks/article/{article_id}/total")
def get_total_stock_by_article(article_id: int, db: Session = Depends(get_db)):
    """
    Récupère le stock total d'un article tous magasins confondus
    avec détail par magasin pour visibilité inter-magasins
    """
    from app.models.magasin import Stock, Article, Magasin

    # Récupérer l'article
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")

    # Récupérer tous les stocks de cet article par magasin
    stocks_par_magasin = db.query(Stock).join(Magasin).filter(
        Stock.article_id == article_id
    ).all()

    # Calculer le total
    total_udb = sum(stock.quantite_udb for stock in stocks_par_magasin)

    # Construire la réponse détaillée
    details = []
    for stock in stocks_par_magasin:
        details.append({
            "magasin_id": stock.magasin_id,
            "magasin_code": stock.magasin.code,
            "magasin_nom": stock.magasin.nom,
            "quantite_disponible": float(stock.quantite_disponible),
            "quantite_udb": float(stock.quantite_udb),
            "statut": stock.statut.value if stock.statut else None
        })

    return {
        "article_id": article_id,
        "code_article": article.code_article,
        "nom_article": article.nom,
        "total_udb": float(total_udb),
        "total_unites": float(sum(s.quantite_disponible for s in stocks_par_magasin)),
        "unite_mesure": article.unite_mesure.value if article.unite_mesure else None,
        "par_magasin": details
    }


@router.get("/stocks/total/{article_id}")
def get_total_stock(article_id: int, db: Session = Depends(get_db)):
    """Calcule le stock total d'un article tous magasins confondus"""
    total = StockService.get_total_stock_by_article(db, article_id)
    return {"article_id": article_id, "total_udb": total}


@router.post("/stocks/filtres", response_model=List[Stock])
    @require_role(["admin", "manager"])

@check_permission("stock:read")
def filter_stocks(filters: StockFilter, db: Session = Depends(get_db)):
    """Filtre les stocks selon plusieurs critères"""
    return StockService.filter_stocks(db, filters)


# ============ COMMANDES ============
@router.get("/commandes", response_model=List[Commande])
def get_commandes(
    skip: int = 0,
    limit: int = 100,
    client_id: Optional[int] = None,
    verrouillees: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Récupère toutes les commandes"""
    if client_id:
        return CommandeService.get_commandes_by_client(db, client_id)
    if verrouillees:
        return CommandeService.get_commandes_verrouillees(db)
    return CommandeService.get_all_commandes(db, skip, limit)


@router.get("/commandes/{commande_id}", response_model=Commande)
def get_commande(commande_id: int, db: Session = Depends(get_db)):
    """Récupère une commande par son ID"""
    commande = CommandeService.get_commande(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


@router.post("/commandes", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:create")
def create_commande(
    commande: CommandeCreate,
    cree_par: str = Query(..., description="Utilisateur qui crée la commande"),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle commande (verrouillée par défaut)"""
    return CommandeService.create_commande(db, commande, cree_par)


@router.put("/commandes/{commande_id}", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:update")
def update_commande(commande_id: int, commande: CommandeUpdate, db: Session = Depends(get_db)):
    """Met à jour une commande"""
    updated_commande = CommandeService.update_commande(db, commande_id, commande)
    if not updated_commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return updated_commande


@router.post("/commandes/{commande_id}/valider-paiement", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:update")
def valider_paiement(
    commande_id: int,
    valide_par: str = Query(..., description="Utilisateur qui valide le paiement"),
    db: Session = Depends(get_db)
):
    """Valide le paiement d'une commande et déverrouille la commande"""
    commande = CommandeService.valider_paiement(db, commande_id, valide_par)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


@router.post("/commandes/{commande_id}/preparer", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:update")
def mettre_en_preparation(commande_id: int, db: Session = Depends(get_db)):
    """Met la commande en préparation"""
    commande = CommandeService.mettre_en_preparation(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée ou paiement non validé")
    return commande


@router.post("/commandes/{commande_id}/prete", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:update")
def marquer_prete(commande_id: int, db: Session = Depends(get_db)):
    """Marque la commande comme prête"""
    commande = CommandeService.marquer_prete(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


@router.post("/commandes/{commande_id}/livree", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:update")
def marquer_livree(commande_id: int, db: Session = Depends(get_db)):
    """Marque la commande comme livrée"""
    commande = CommandeService.marquer_livree(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


@router.post("/commandes/{commande_id}/annuler", response_model=Commande)
    @require_role(["admin", "manager"])

@check_permission("commande:update")
def annuler_commande(commande_id: int, db: Session = Depends(get_db)):
    """Annule une commande"""
    commande = CommandeService.annuler_commande(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


# ============ BANDES DE LIVRAISON ============
@router.get("/bandes-livraison", response_model=List[BandeLivraison])
def get_bandes(
    skip: int = 0,
    limit: int = 100,
    commande_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Récupère toutes les bandes de livraison"""
    if commande_id:
        return BandeLivraisonService.get_bandes_by_commande(db, commande_id)
    return BandeLivraisonService.get_all_bandes(db, skip, limit)


@router.get("/bandes-livraison/{bande_id}", response_model=BandeLivraison)
def get_bande(bande_id: int, db: Session = Depends(get_db)):
    """Récupère une bande de livraison par son ID"""
    bande = BandeLivraisonService.get_bande(db, bande_id)
    if not bande:
        raise HTTPException(status_code=404, detail="Bande de livraison non trouvée")
    return bande


@router.post("/bandes-livraison", response_model=BandeLivraison)
    @require_role(["admin", "manager"])

@check_permission("bande:create")
def create_bande(
    bande: BandeLivraisonCreate,
    prepare_par: str = Query(..., description="Utilisateur qui prépare la bande"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle bande de livraison avec mise à jour automatique du stock"""
    return BandeLivraisonService.create_bande(db, bande, prepare_par, current_user.id)


@router.put("/bandes-livraison/{bande_id}", response_model=BandeLivraison)
    @require_role(["admin", "manager"])

@check_permission("bande:update")
def update_bande(bande_id: int, bande: BandeLivraisonUpdate, db: Session = Depends(get_db)):
    """Met à jour une bande de livraison"""
    updated_bande = BandeLivraisonService.update_bande(db, bande_id, bande)
    if not updated_bande:
        raise HTTPException(status_code=404, detail="Bande de livraison non trouvée")
    return updated_bande


# ============ NOUVEAUX ENDPOINTS POUR LA GÉNÉRATION DE BANDE DE LIVRAISON À PARTIR D'OT ============
@router.post("/bandes-livraison/from-ordre-transfert/{ot_id}", response_model=BandeLivraison)
    @require_role(["admin", "manager"])
@check_permission("bande:create")
def create_bande_from_ordre_transfert(
    ot_id: int,
    prepare_par: str = Query(..., description="Utilisateur qui prépare la bande"),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Génère une bande de livraison à partir d'un ordre de transfert validé"""
    return BandeLivraisonService.create_bande_from_ordre_transfert(db, ot_id, prepare_par, current_user.id)


@router.get("/bandes-livraison/ordre-transfert/{ot_id}", response_model=BandeLivraison)
@check_permission("bande:read")
def get_bande_by_ordre_transfert(
    ot_id: int,
    db: Session = Depends(get_db)
):
    """Récupère la bande de livraison associée à un ordre de transfert"""
    bande = db.query(BandeLivraison).filter(BandeLivraison.ordre_transfert_id == ot_id).first()
    if not bande:
        raise HTTPException(status_code=404, detail="Bande de livraison non trouvée pour cet ordre de transfert")
    return bande


# ============ ORDRES DE TRANSFERT ============
@router.get("/ordres-transfert", response_model=List[OrdreTransfert])
def get_ordres_transfert(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les ordres de transfert"""
    return OrdreTransfertService.get_all(db, skip, limit)


@router.get("/ordres-transfert/{ot_id}", response_model=OrdreTransfert)
def get_ordre_transfert(ot_id: int, db: Session = Depends(get_db)):
    """Récupère un ordre de transfert par son ID"""
    ot = OrdreTransfertService.get_by_id(db, ot_id)
    if not ot:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
    return ot


@router.get("/ordres-transfert/declaration/{declaration_id}", response_model=List[OrdreTransfert])
def get_ordres_transfert_by_declaration(declaration_id: int, db: Session = Depends(get_db)):
    """Récupère les OT liés à une déclaration BL"""
    return OrdreTransfertService.get_by_declaration(db, declaration_id)


@router.post("/ordres-transfert", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:create")
def create_ordre_transfert(
    ot: OrdreTransfertCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée un nouvel ordre de transfert (statut BROUILLON)"""
    return OrdreTransfertService.create(db, ot, current_user.username)


@router.put("/ordres-transfert/{ot_id}", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:update")
def update_ordre_transfert(
    ot_id: int,
    ot: OrdreTransfertUpdate,
    db: Session = Depends(get_db)
):
    """Met à jour un OT (seulement si BROUILLON)"""
    updated = OrdreTransfertService.update(db, ot_id, ot)
    if not updated:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
    return updated


@router.post("/ordres-transfert/{ot_id}/valider", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:update")
def valider_ordre_transfert(
    ot_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Valide un OT → déstocke le magasin source"""
    result = OrdreTransfertService.valider(db, ot_id, current_user.username, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
    return result


@router.post("/ordres-transfert/{ot_id}/expedier", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:update")
def expedier_ordre_transfert(
    ot_id: int,
    db: Session = Depends(get_db)
):
    """Marque l'OT comme expédié (en transit)"""
    result = OrdreTransfertService.expedier(db, ot_id)
    if not result:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
    return result


@router.post("/ordres-transfert/{ot_id}/receptionner", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:update")
def receptionner_ordre_transfert(
    ot_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Réceptionne l'OT → stocke dans le magasin destination"""
    result = OrdreTransfertService.receptionner(db, ot_id, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
    return result


@router.post("/ordres-transfert/{ot_id}/annuler", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:update")
def annuler_ordre_transfert(
    ot_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Annule un OT (reverse le stock si nécessaire)"""
    result = OrdreTransfertService.annuler(db, ot_id, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
    return result


# ============ TRANSACTIONS (OPERATIONS) ============
@router.get("/transactions", response_model=List[dict])
def get_magasin_transactions(db: Session = Depends(get_db)):
    """Récupère la liste des transactions/operations disponibles dans le module magasin"""
    from app.models.magasin import Transaction
    transactions = db.query(Transaction).filter(Transaction.est_actif == True).all()
    return [
        {
            "code_transaction": t.code_transaction,
            "nom": t.nom,
            "description": t.description,
            "interface": t.interface
        }
        for t in transactions
    ]


@router.get("/stock-statuses", response_model=List[str])
def get_stock_statuses():
    """Récupère la liste des statuts de stock disponibles"""
    from app.models.magasin import StatutStock
    return [status.value for status in StatutStock]


@router.get("/history", response_model=List[dict])
def get_magasin_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère l'historique des mouvements de stock pour analytique"""
    from app.models.audit import AuditLog
    from sqlalchemy import desc

    # Récupérer les logs d'audit liés aux mouvements de stock
    # On filtre sur les entités concernées par les mouvements de stock
    audit_logs = db.query(AuditLog).filter(
        AuditLog.table_name.in_([
            'receptions', 'lignes_reception',
            'commandes', 'lignes_commande',
            'bandes_livraison', 'lignes_bande_livraison',
            'ordres_transfert', 'lignes_ordre_transfert',
            'stocks'
        ])
    ).order_by(desc(AuditLog.date_creation)).offset(skip).limit(limit).all()

    # Transformer les logs d'audit en format adapté pour le frontend
    history_data = []
    for log in audit_logs:
        try:
            # Déterminer la date du mouvement
            date_mouvement = log.date_creation.isoformat() if log.date_creation else None

            # Extraire l'ID de l'article depuis les nouvelles ou anciennes valeurs
            article_id = None
            if log.new_values and isinstance(log.new_values, dict):
                # Chercher l'ID d'article dans les champs courants
                article_id = log.new_values.get('article_id') or log.new_values.get('articleId')
                if not article_id and 'lignes' in log.new_values:
                    # Cas particulier pour les entités qui ont des lignes
                    lignes = log.new_values.get('lignes', [])
                    if lignes and isinstance(lignes, list) and len(lignes) > 0:
                        article_id = lignes[0].get('article_id') if isinstance(lignes[0], dict) else None

            # Si pas trouvé dans new_values, essayer dans old_values
            if not article_id and log.old_values and isinstance(log.old_values, dict):
                article_id = log.old_values.get('article_id') or log.old_values.get('articleId')
                if not article_id and 'lignes' in log.old_values:
                    lignes = log.old_values.get('lignes', [])
                    if lignes and isinstance(lignes, list) and len(lignes) > 0:
                        article_id = lignes[0].get('article_id') if isinstance(lignes[0], dict) else None

            # Si toujours pas d'article_id, essayer d'extraire depuis record_id or context
            if not article_id:
                # Pour les stocks, le record_id contient souvent l'information
                if log.table_name == 'stocks' and log.record_id:
                    # Format possible: "magasin_id:article_id" ou similaire
                    parts = str(log.record_id).split(':')
                    if len(parts) >= 2:
                        try:
                            article_id = int(parts[1])
                        except ValueError:
                            pass

            # Ajouter à l'historique seulement si nous avons un article_id et une date
            if article_id and date_mouvement:
                history_data.append({
                    "id": log.id,
                    "date_mouvement": date_mouvement,
                    "article_id": int(article_id),
                    "action": log.action,
                    "table_name": log.table_name,
                    "user_id": log.user_id,
                    "context": log.context
                })
        except (ValueError, TypeError, KeyError):
            # Ignorer les entrées qui ne peuvent pas être parsées correctement
            continue

    return history_data


# ============ FEATURES INTELLIGENTES (IA) ============
@router.post("/ai/query")
    @require_role(["admin", "manager"])
def query_ai_natural_language(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Traite une requête en langage naturel et retourne les résultats appropriés.
    Endpoint pour l'assistant IA du module K-Magasin.
    """
    from app.services.ai_service import ai_service

    result = ai_service.process_natural_language_query(db, query, current_user)
    return result


@router.post("/ai/document/process")
    @require_role(["admin", "manager"])
def process_document_with_ai(
    file_content: str,  # Base64 encoded
    file_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Traite un document uploadé avec OCR/IA pour extraire les données structurées.
    Supporte les factures, BL, bons de commande, etc.
    """
    from app.services.ai_service import ai_service
    import base64

    try:
        # Décoder le contenu base64
        decoded_content = base64.b64decode(file_content)
        result = ai_service.process_document_ocr(decoded_content, file_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur de traitement du document: {str(e)}")


@router.get("/ai/suggest")
def get_ai_query_suggestions(
    partial: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retourne des suggestions de complétion pour les requêtes en langage naturel.
    Utile pour l'autocompletion dans l'interface.
    """
    from app.services.ai_service import ai_service

    suggestions = ai_service.suggest_query_completions(partial)
    return {"suggestions": suggestions}


# ============ ANALYTIQUE AVANCÉE ============
@router.post("/analytics/demand-forecast")
    @require_role(["admin", "manager"])
def generate_demand_forecast(
    article_id: int,
    magasin_id: Optional[int] = None,
    horizon_days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère une prévision de la demande pour un article donné.
    Nécessite les permissions de lecture sur les articles et les stocks.
    """
    from app.services.advanced_analytics_service import advanced_analytics_service

    # Vérifier que l'article existe
    article = ArticleService.get_article_by_id(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")

    # Vérifier que le magasin existe si spécifié
    if magasin_id:
        magasin = MagasinService.get_magasin(db, magasin_id)
        if not magasin:
            raise HTTPException(status_code=404, detail="Magasin non trouvé")

    # Générer la prévision
    forecast_report = advanced_analytics_service.generate_demand_forecast_report(
        db=db,
        article_id=article_id,
        magasin_id=magasin_id,
        horizon_days=horizon_days
    )
    return forecast_report


@router.post("/analytics/stock-turnover")
    @require_role(["admin", "manager"])
def analyze_stock_turnover(
    article_id: int,
    months: int = 12,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyse le taux de rotation du stock pour un article donné.
    Nécessite les permissions de lecture sur les articles et les stocks.
    """
    from app.services.advanced_analytics_service import advanced_analytics_service

    # Vérifier que l'article existe
    article = ArticleService.get_article_by_id(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")

    # Générer l'analyse de rotation
    turnover_report = advanced_analytics_service.analyze_stock_turnover(
        db=db,
        article_id=article_id,
        months=months
    )
    return turnover_report


@router.post("/analytics/safety-stock")
    @require_role(["admin", "manager"])
def calculate_safety_stock(
    article_id: int,
    magasin_id: int,
    service_level: float = 0.95,
    lead_time_days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcule le stock de sécurité pour un article dans un magasin donné.
    Nécessite les permissions de lecture sur les articles, les stocks et les magasins.
    """
    from app.services.advanced_analytics_service import advanced_analytics_service

    # Vérifier que l'article existe
    article = ArticleService.get_article_by_id(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")

    # Vérifier que le magasin existe
    magasin = MagasinService.get_magasin(db, magasin_id)
    if not magasin:
        raise HTTPException(status_code=404, detail="Magasin non trouvé")

    # Valider les paramètres
    if not 0.5 <= service_level <= 0.99:
        raise HTTPException(status_code=400, detail="Le niveau de service doit être entre 0.5 et 0.99")

    if lead_time_days < 1:
        raise HTTPException(status_code=400, detail="Le délai de réapprovisionnement doit être d'au moins 1 jour")

    # Calculer le stock de sécurité
    safety_stock_report = advanced_analytics_service.calculate_safety_stock(
        db=db,
        article_id=article_id,
        magasin_id=magasin_id,
        service_level=service_level,
        lead_time_days=lead_time_days
    )
    return safety_stock_report


@router.post("/analytics/anomaly-detection")
    @require_role(["admin", "manager"])
def detect_stock_movement_anomalies(
    article_id: int,
    magasin_id: int,
    days: int = 30,
    sensitivity: float = 2.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Détecte les anomalies dans les mouvements de stock pour un article dans un magasin donné.
    Nécessite les permissions de lecture sur les articles, les stocks et les magasins.
    """
    from app.services.advanced_analytics_service import advanced_analytics_service

    # Vérifier que l'article existe
    article = ArticleService.get_article_by_id(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")

    # Vérifier que le magasin existe
    magasin = MagasinService.get_magasin(db, magasin_id)
    if not magasin:
        raise HTTPException(status_code=404, detail="Magasin non trouvé")

    # Valider les paramètres
    if days < 7:
        raise HTTPException(status_code=400, detail="La période d'analyse doit être d'au moins 7 jours")

    if sensitivity < 0.5:
        raise HTTPException(status_code=400, detail="La sensibilité doit être d'au moins 0.5")

    # Détecter les anomalies
    anomaly_report = advanced_analytics_service.detect_anomalies_in_stock_movements(
        db=db,
        article_id=article_id,
        magasin_id=magasin_id,
        days=days,
        sensitivity=sensitivity
    )
    return anomaly_report


# ============ RAPPORTS AVANCÉS ============
@router.post("/reports/stock-valuation")
    @require_role(["admin", "manager"])
def generate_stock_valuation_report(
    filters: Dict[str, Any] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère un rapport de valorisation du stock.
    Nécessite les permissions de lecture sur le stock.
    """
    from app.services.reporting_service import reporting_service

    # Vérifier les permissions (déjà fait par le dépendance get_current_user avec check_permission dans les autres endpoints)
    # On pourrait ajouter un check_permission spécifique ici si nécessaire

    report = reporting_service.create_stock_valuation_report(db, filters)
    return report


@router.post("/reports/mouvement-analysis")
    @require_role(["admin", "manager"])
def generate_mouvement_analysis_report(
    start_date: str,  # Format ISO: YYYY-MM-DD
    end_date: str,    # Format ISO: YYYY-MM-DD
    filters: Dict[str, Any] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère un rapport d'analyse des mouvements sur une période donnée.
    """
    from app.services.reporting_service import reporting_service
    from datetime import datetime

    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date invalide. Utiliser YYYY-MM-DD")

    report = reporting_service.create_mouvement_analysis_report(db, start_dt, end_dt, filters)
    return report


@router.post("/reports/client-performance")
    @require_role(["admin", "manager"])
def generate_client_performance_report(
    start_date: str,  # Format ISO: YYYY-MM-DD
    end_date: str,    # Format ISO: YYYY-MM-DD
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère un rapport de performance des clients/fournisseurs sur une période donnée.
    """
    from app.services.reporting_service import reporting_service
    from datetime import datetime

    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date invalide. Utiliser YYYY-MM-DD")

    report = reporting_service.create_client_performance_report(db, start_dt, end_dt)
    return report


@router.post("/reports/export/csv")
    @require_role(["admin", "manager"])
def export_report_to_csv(
    data: List[Dict[str, Any]],
    filename: str = "report.csv",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Exporte des données de rapport vers un fichier CSV.
    """
    from app.services.reporting_service import reporting_service

    csv_content = reporting_service.export_to_csv(data, filename)
    return {
        "content": csv_content,
        "filename": filename,
        "content_type": "text/csv"
    }


@router.post("/reports/export/json")
    @require_role(["admin", "manager"])
def export_report_to_json(
    data: Any,
    filename: str = "report.json",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Exporte des données de rapport vers un fichier JSON.
    """
    from app.services.reporting_service import reporting_service

    json_content = reporting_service.export_to_json(data)
    return {
        "content": json_content,
        "filename": filename,
        "content_type": "application/json"
    }

# ============ ORDRES DE TRANSFERT (BON D'ENLEVEMENT) ============

@router.post("/ordres-transfert", response_model=OrdreTransfert)
    @require_role(["admin", "manager"])
@check_permission("magasin:create")
def create_ordre_transfert(
    ot_data: OrdreTransfertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée un Ordre de Transfert (restera bloqué jusqu'à validation Service Client)"""
    # Générer le numéro OT (Format: OT-YYYY-XXXX)
    from datetime import datetime
    from app.models.magasin import OrdreTransfert as OTModel, LigneOrdreTransfert as LOTModel
    
    year = datetime.now().year
    count = db.query(OTModel).filter(OTModel.numero_ot.like(f"OT-{year}-%")).count()
    numero_ot = f"OT-{year}-{count + 1:04d}"

    db_ot = OTModel(
        numero_ot=numero_ot,
        declaration_id=ot_data.declaration_id,
        magasin_source_id=ot_data.magasin_source_id,
        magasin_dest_id=ot_data.magasin_dest_id,
        motif=ot_data.motif,
        notes=ot_data.notes,
        cree_par=current_user.nom
    )
    db.add(db_ot)
    db.flush()
    
    for ligne in ot_data.lignes:
        db_ligne = LOTModel(
            ordre_transfert_id=db_ot.id,
            article_id=ligne.article_id,
            quantite=ligne.quantite,
            unite_mesure=ligne.unite_mesure
        )
        db.add(db_ligne)
        
    db.commit()
    db.refresh(db_ot)
    return db_ot


@router.post("/ordres-transfert/{ot_id}/valider-paiement")
    @require_role(["admin", "manager"])
@check_permission("finance:update") # Seul le service client ou finance peut le faire
def valider_paiement_ot(
    ot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Débloque l'Ordre de Transfert suite au paiement et génère le Bon d'Enlèvement en 5 exemplaires (PDF)"""
    from app.models.magasin import OrdreTransfert as OTModel, StatutOrdreTransfert
    from app.tasks.magasin_tasks import generate_bon_enlevement_pdf_async
    
    ot = db.query(OTModel).filter(OTModel.id == ot_id).first()
    if not ot:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
        
    if ot.statut != StatutOrdreTransfert.BROUILLON:
        raise HTTPException(status_code=400, detail="L'OT n'est pas en brouillon")
        
    ot.validation_service_client = True
    ot.paiement_effectue = True
    ot.statut = StatutOrdreTransfert.VALIDE
    ot.autorise_par = current_user.nom
    ot.date_validation = datetime.now(timezone.utc)
    
    # Destockage virtuel du magasin source pourrait se faire ici
    db.commit()
    
    # Générer le PDF (Bon d'enlèvement) de façon asynchrone
    generate_bon_enlevement_pdf_async.delay(ot.id)
    
    return {"message": "Paiement validé, OT débloqué, génération du Bon d'Enlèvement en cours"}


@router.post("/ordres-transfert/{ot_id}/annuler")
    @require_role(["admin", "manager"])
@check_permission("magasin:delete")
def annuler_ot(
    ot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Annule un Ordre de Transfert instantanément"""
    from app.models.magasin import OrdreTransfert as OTModel, StatutOrdreTransfert
    ot = db.query(OTModel).filter(OTModel.id == ot_id).first()
    if not ot:
        raise HTTPException(status_code=404, detail="Ordre de transfert non trouvé")
        
    if ot.statut in [StatutOrdreTransfert.RECEPTIONNE]:
        raise HTTPException(status_code=400, detail="Impossible d'annuler un OT déjà réceptionné")
        
    ot.statut = StatutOrdreTransfert.ANNULE
    db.commit()
    return {"message": "Ordre de transfert annulé"}


# ============ IMPORT/EXPORT ============
@router.post("/import/export/articles/csv")
    @require_role(["admin", "manager"])
@check_permission("article:create")
def import_articles_from_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Importe des articles depuis un fichier CSV"""
    try:
        content = file.file.read().decode("utf-8")
        results = ImportExportService.import_articles_from_csv(db, content, current_user.id)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/import/export/articles/csv/export")
    @require_role(["admin", "manager"])
@check_permission("article:read")
def export_articles_to_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Exporte les articles vers un fichier CSV"""
    csv_content = ImportExportService.export_articles_to_csv(db)
    return {
        "content": csv_content,
        "filename": "articles.csv",
        "content_type": "text/csv"
    }


@router.post("/import/export/clients/csv")
    @require_role(["admin", "manager"])
@check_permission("magasin:create")
def import_clients_from_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Importe des clients depuis un fichier CSV"""
    try:
        content = file.file.read().decode("utf-8")
        results = ImportExportService.import_clients_from_csv(db, content, current_user.id)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/import/export/clients/csv/export")
    @require_role(["admin", "manager"])
@check_permission("magasin:read")
def export_clients_to_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Exporte les clients vers un fichier CSV"""
    csv_content = ImportExportService.export_clients_to_csv(db)
    return {
        "content": csv_content,
        "filename": "clients.csv",
        "content_type": "text/csv"
    }


@router.post("/import/export/magasins/csv")
    @require_role(["admin", "manager"])
@check_permission("magasin:create")
def import_magasins_from_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Importe des magasins depuis un fichier CSV"""
    try:
        content = file.file.read().decode("utf-8")
        results = ImportExportService.import_magasins_from_csv(db, content, current_user.id)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/import/export/magasins/csv/export")
    @require_role(["admin", "manager"])
@check_permission("magasin:read")
def export_magasins_to_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Exporte les magasins vers un fichier CSV"""
    csv_content = ImportExportService.export_magasins_to_csv(db)
    return {
        "content": csv_content,
        "filename": "magasins.csv",
        "content_type": "text/csv"
    }


@router.post("/articles/bulk")
    @require_role(["admin", "manager"])
@check_permission("article:create")
def create_articles_bulk(
    articles: List[ArticleCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée plusieurs articles en une seule opération"""
    try:
        results = {
            "success": [],
            "errors": [],
            "total_processed": len(articles),
            "total_success": 0,
            "total_errors": 0
        }
        for idx, article_data in enumerate(articles):
            try:
                article = ArticleService.create_article(db, article_data)
                results["success"].append({
                    "index": idx,
                    "code_article": article.code_article,
                    "message": "Article créé avec succès"
                })
                results["total_success"] += 1
            except Exception as e:
                results["errors"].append({
                    "index": idx,
                    "data": article_data.dict() if hasattr(article_data, 'dict') else str(article_data),
                    "message": str(e)
                })
                results["total_errors"] += 1
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
