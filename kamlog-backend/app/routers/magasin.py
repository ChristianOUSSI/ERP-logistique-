# app/routers/magasin.py - Routes API pour le module K-magasin
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

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
    BandeLivraison, BandeLivraisonCreate, BandeLivraisonUpdate
)
from app.services.magasin_service import (
    MagasinService, ClientMagasinService, ArticleService,
    DeclarationService, ReceptionService, StockService,
    CommandeService, BandeLivraisonService
)


limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["K-Magasin"])


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
@check_permission("magasin:create")
def create_magasin(magasin: MagasinCreate, db: Session = Depends(get_db)):
    """Crée un nouveau magasin"""
    return MagasinService.create_magasin(db, magasin)


@router.put("/magasins/{magasin_id}", response_model=Magasin)

@check_permission("magasin:update")
def update_magasin(magasin_id: int, magasin: MagasinUpdate, db: Session = Depends(get_db)):
    """Met à jour un magasin"""
    updated_magasin = MagasinService.update_magasin(db, magasin_id, magasin)
    if not updated_magasin:
        raise HTTPException(status_code=404, detail="Magasin non trouvé")
    return updated_magasin


@router.delete("/magasins/{magasin_id}")

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

@check_permission("magasin:create")
def create_client(client: ClientMagasinCreate, db: Session = Depends(get_db)):
    """Crée un nouveau client"""
    return ClientMagasinService.create_client(db, client)


@router.put("/clients/{client_id}", response_model=ClientMagasin)

@check_permission("magasin:update")
def update_client(client_id: int, client: ClientMagasinUpdate, db: Session = Depends(get_db)):
    """Met à jour un client"""
    updated_client = ClientMagasinService.update_client(db, client_id, client)
    if not updated_client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return updated_client


@router.delete("/clients/{client_id}")

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


@router.get("/articles/{article_id}", response_model=Article)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Récupère un article par son ID"""
    article = ArticleService.get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return article


@router.get("/articles/code/{code_article}", response_model=Article)
def get_article_by_code(code_article: str, db: Session = Depends(get_db)):
    """Récupère un article par son code"""
    article = ArticleService.get_article_by_code(db, code_article)
    if not article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return article


@router.post("/articles", response_model=Article)

@check_permission("article:create")
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """Crée un nouvel article avec génération automatique du code si non fourni"""
    return ArticleService.create_article(db, article)


@router.put("/articles/{article_id}", response_model=Article)

@check_permission("article:update")
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    """Met à jour un article"""
    updated_article = ArticleService.update_article(db, article_id, article)
    if not updated_article:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return updated_article


@router.delete("/articles/{article_id}")

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


@router.post("/declarations", response_model=Declaration)

@check_permission("declaration:create")
def create_declaration(
    declaration: DeclarationCreate,
    cree_par: str = Query(..., description="Utilisateur qui crée la déclaration"),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle déclaration (Bill of Lading)"""
    return DeclarationService.create_declaration(db, declaration, cree_par)


@router.put("/declarations/{declaration_id}", response_model=Declaration)

@check_permission("declaration:update")
def update_declaration(declaration_id: int, declaration: DeclarationUpdate, db: Session = Depends(get_db)):
    """Met à jour une déclaration"""
    updated_declaration = DeclarationService.update_declaration(db, declaration_id, declaration)
    if not updated_declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return updated_declaration


@router.post("/declarations/{declaration_id}/valider", response_model=Declaration)

@check_permission("declaration:update")
def valider_declaration(declaration_id: int, db: Session = Depends(get_db)):
    """Valide une déclaration"""
    declaration = DeclarationService.valider_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return declaration


@router.post("/declarations/{declaration_id}/annuler", response_model=Declaration)

@check_permission("declaration:update")
def annuler_declaration(declaration_id: int, db: Session = Depends(get_db)):
    """Annule une déclaration"""
    declaration = DeclarationService.annuler_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(status_code=404, detail="Déclaration non trouvée")
    return declaration


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

@check_permission("reception:update")
def update_reception(reception_id: int, reception: ReceptionUpdate, db: Session = Depends(get_db)):
    """Met à jour une réception"""
    updated_reception = ReceptionService.update_reception(db, reception_id, reception)
    if not updated_reception:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    return updated_reception


@router.post("/receptions/{reception_id}/completer", response_model=Reception)

@check_permission("reception:update")
def completer_reception(reception_id: int, db: Session = Depends(get_db)):
    """Marque une réception comme complète"""
    reception = ReceptionService.completer_reception(db, reception_id)
    if not reception:
        raise HTTPException(status_code=404, detail="Réception non trouvée")
    return reception


@router.post("/receptions/{reception_id}/annuler", response_model=Reception)

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


@router.get("/stocks/total/{article_id}")
def get_total_stock(article_id: int, db: Session = Depends(get_db)):
    """Calcule le stock total d'un article tous magasins confondus"""
    total = StockService.get_total_stock_by_article(db, article_id)
    return {"article_id": article_id, "total_udb": total}


@router.post("/stocks/filtres", response_model=List[Stock])

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

@check_permission("commande:create")
def create_commande(
    commande: CommandeCreate,
    cree_par: str = Query(..., description="Utilisateur qui crée la commande"),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle commande (verrouillée par défaut)"""
    return CommandeService.create_commande(db, commande, cree_par)


@router.put("/commandes/{commande_id}", response_model=Commande)

@check_permission("commande:update")
def update_commande(commande_id: int, commande: CommandeUpdate, db: Session = Depends(get_db)):
    """Met à jour une commande"""
    updated_commande = CommandeService.update_commande(db, commande_id, commande)
    if not updated_commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return updated_commande


@router.post("/commandes/{commande_id}/valider-paiement", response_model=Commande)

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

@check_permission("commande:update")
def mettre_en_preparation(commande_id: int, db: Session = Depends(get_db)):
    """Met la commande en préparation"""
    commande = CommandeService.mettre_en_preparation(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée ou paiement non validé")
    return commande


@router.post("/commandes/{commande_id}/prete", response_model=Commande)

@check_permission("commande:update")
def marquer_prete(commande_id: int, db: Session = Depends(get_db)):
    """Marque la commande comme prête"""
    commande = CommandeService.marquer_prete(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


@router.post("/commandes/{commande_id}/livree", response_model=Commande)

@check_permission("commande:update")
def marquer_livree(commande_id: int, db: Session = Depends(get_db)):
    """Marque la commande comme livrée"""
    commande = CommandeService.marquer_livree(db, commande_id)
    if not commande:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    return commande


@router.post("/commandes/{commande_id}/annuler", response_model=Commande)

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

@check_permission("bande:update")
def update_bande(bande_id: int, bande: BandeLivraisonUpdate, db: Session = Depends(get_db)):
    """Met à jour une bande de livraison"""
    updated_bande = BandeLivraisonService.update_bande(db, bande_id, bande)
    if not updated_bande:
        raise HTTPException(status_code=404, detail="Bande de livraison non trouvée")
    return updated_bande
