# app/schemas/magasin.py - Schémas Pydantic pour le module K-magasin
from pydantic import BaseModel, Field, validator, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from enum import Enum


class UniteMesure(str, Enum):
    """Unités de mesure pour les marchandises"""
    UDB = "UDB"
    KG = "KG"
    TONNE = "TONNE"
    M3 = "M3"
    M2 = "M2"
    UNITE = "UNITE"


class StatutDeclaration(str, Enum):
    """Statuts des déclarations"""
    BROUILLON = "BROUILLON"
    VALIDEE = "VALIDEE"
    ANNULEE = "ANNULEE"


class StatutReception(str, Enum):
    """Statuts des réceptions"""
    EN_COURS = "EN_COURS"
    COMPLETEE = "COMPLETEE"
    ANNULEE = "ANNULEE"


class StatutCommande(str, Enum):
    """Statuts des commandes"""
    EN_ATTENTE = "EN_ATTENTE"
    VERROUILLEE = "VERROUILLEE"
    PAYEE = "PAYEE"
    EN_PREPARATION = "EN_PREPARATION"
    PRETE = "PRETE"
    LIVREE = "LIVREE"
    ANNULEE = "ANNULEE"


# ============ MAGASIN ============
class MagasinBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=20)
    nom: str = Field(..., min_length=2, max_length=100)
    adresse: Optional[str] = Field(None, max_length=255)
    ville: Optional[str] = Field(None, max_length=100)
    pays: str = Field(default="Cameroun", max_length=100)
    telephone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    est_actif: bool = True


class MagasinCreate(MagasinBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code": "MAG-001",
                "nom": "Magasin Principal",
                "adresse": "123 Rue du Port",
                "ville": "Douala",
                "pays": "Cameroun",
                "telephone": "+237 123 456 789",
                "email": "magasin@kamlog.cm",
                "est_actif": True
            }
        }
    )


class MagasinUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=100)
    adresse: Optional[str] = Field(None, max_length=255)
    ville: Optional[str] = Field(None, max_length=100)
    pays: Optional[str] = Field(None, max_length=100)
    telephone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    est_actif: Optional[bool] = None


class Magasin(MagasinBase):
    id: int
    date_creation: datetime
    date_modification: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============ CLIENT MAGASIN ============
class ClientMagasinBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=20)
    nom: str = Field(..., min_length=2, max_length=100)
    prenom: Optional[str] = Field(None, max_length=100)
    raison_sociale: Optional[str] = Field(None, max_length=200)
    telephone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    adresse: Optional[str] = Field(None, max_length=255)
    ville: Optional[str] = Field(None, max_length=100)
    pays: str = Field(default="Cameroun", max_length=100)
    numero_contribuable: Optional[str] = Field(None, max_length=50)
    est_actif: bool = True


class ClientMagasinCreate(ClientMagasinBase):
    pass


class ClientMagasinUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=100)
    prenom: Optional[str] = Field(None, max_length=100)
    raison_sociale: Optional[str] = Field(None, max_length=200)
    telephone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    adresse: Optional[str] = Field(None, max_length=255)
    ville: Optional[str] = Field(None, max_length=100)
    pays: Optional[str] = Field(None, max_length=100)
    numero_contribuable: Optional[str] = Field(None, max_length=50)
    est_actif: Optional[bool] = None


class ClientMagasin(ClientMagasinBase):
    id: int
    date_creation: datetime
    date_modification: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============ ARTICLE ============
class ArticleBase(BaseModel):
    code_article: str = Field(..., min_length=7, max_length=20)
    nom: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    unite_mesure: UniteMesure = UniteMesure.UDB
    poids_unitaire: Optional[float] = Field(None, ge=0)
    volume_unitaire: Optional[float] = Field(None, ge=0)
    est_actif: bool = True

    @validator('code_article')
    def validate_code_article(cls, v):
        """Le code d'article doit commencer par 1 et avoir 7 chiffres minimum"""
        if not v.startswith('1'):
            raise ValueError('Le code d\'article doit commencer par 1')
        if len(v) < 7:
            raise ValueError('Le code d\'article doit avoir au moins 7 chiffres')
        return v


class ArticleCreate(ArticleBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code_article": "1000001",
                "nom": "Conteneur 20 pieds",
                "description": "Conteneur maritime standard 20 pieds",
                "unite_mesure": "UDB",
                "poids_unitaire": 2500.0,
                "volume_unitaire": 33.0,
                "est_actif": True
            }
        }
    )


class ArticleUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    unite_mesure: Optional[UniteMesure] = None
    poids_unitaire: Optional[float] = Field(None, ge=0)
    volume_unitaire: Optional[float] = Field(None, ge=0)
    est_actif: Optional[bool] = None


class Article(ArticleBase):
    id: int
    date_creation: datetime
    date_modification: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============ LIGNE DECLARATION ============
class LigneDeclarationBase(BaseModel):
    article_id: int
    quantite_declaree: Decimal = Field(..., gt=0, decimal_places=3)
    unite_mesure: UniteMesure
    quantite_udb: Optional[Decimal] = Field(None, ge=0, decimal_places=3)


class LigneDeclarationCreate(LigneDeclarationBase):
    pass


class LigneDeclaration(LigneDeclarationBase):
    id: int
    declaration_id: int
    article: Optional[Article] = None

    class Config:
        from_attributes = True


# ============ DECLARATION ============
class DeclarationBase(BaseModel):
    client_id: int
    date_arrivee_prevue: Optional[datetime] = None
    statut: StatutDeclaration = StatutDeclaration.BROUILLON
    notes: Optional[str] = Field(None, max_length=500)


class DeclarationCreate(DeclarationBase):
    lignes: List[LigneDeclarationCreate] = []
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "client_id": 1,
                "date_arrivee_prevue": "2026-06-15T10:00:00",
                "statut": "BROUILLON",
                "notes": "Déclaration de marchandise en provenance de Chine",
                "lignes": [
                    {
                        "article_id": 1,
                        "quantite_declaree": 100.0,
                        "unite_mesure": "UDB"
                    }
                ]
            }
        }
    )


class DeclarationUpdate(BaseModel):
    date_arrivee_prevue: Optional[datetime] = None
    statut: Optional[StatutDeclaration] = None
    notes: Optional[str] = Field(None, max_length=500)


class Declaration(DeclarationBase):
    id: int
    numero_bl: str
    date_declaration: datetime
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    client: Optional[ClientMagasin] = None
    lignes: List[LigneDeclaration] = []

    class Config:
        from_attributes = True


# ============ LIGNE RECEPTION ============
class LigneReceptionBase(BaseModel):
    article_id: int
    quantite_recue: Decimal = Field(..., gt=0, decimal_places=3)
    unite_mesure: UniteMesure
    quantite_udb: Optional[Decimal] = Field(None, ge=0, decimal_places=3)


class LigneReceptionCreate(LigneReceptionBase):
    pass


class LigneReception(LigneReceptionBase):
    id: int
    reception_id: int
    article: Optional[Article] = None

    class Config:
        from_attributes = True


# ============ RECEPTION ============
class ReceptionBase(BaseModel):
    declaration_id: int
    magasin_id: int
    statut: StatutReception = StatutReception.EN_COURS
    notes: Optional[str] = Field(None, max_length=500)


class ReceptionCreate(ReceptionBase):
    lignes: List[LigneReceptionCreate] = []
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "declaration_id": 1,
                "magasin_id": 1,
                "statut": "EN_COURS",
                "notes": "Réception de marchandise déclarée",
                "lignes": [
                    {
                        "article_id": 1,
                        "quantite_recue": 95.0,
                        "unite_mesure": "UDB"
                    }
                ]
            }
        }
    )


class ReceptionUpdate(BaseModel):
    statut: Optional[StatutReception] = None
    notes: Optional[str] = Field(None, max_length=500)


class Reception(ReceptionBase):
    id: int
    numero_reception: str
    date_reception: datetime
    recu_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    declaration: Optional[Declaration] = None
    magasin: Optional[Magasin] = None
    lignes: List[LigneReception] = []

    class Config:
        from_attributes = True


# ============ STOCK ============
class StockBase(BaseModel):
    magasin_id: int
    article_id: int
    quantite_disponible: Decimal = Field(default=0, ge=0, decimal_places=3)
    quantite_udb: Decimal = Field(default=0, ge=0, decimal_places=3)


class StockCreate(StockBase):
    pass


class StockUpdate(BaseModel):
    quantite_disponible: Optional[Decimal] = Field(None, ge=0, decimal_places=3)
    quantite_udb: Optional[Decimal] = Field(None, ge=0, decimal_places=3)


class Stock(StockBase):
    id: int
    derniere_maj: Optional[datetime] = None
    date_creation: datetime
    magasin: Optional[Magasin] = None
    article: Optional[Article] = None

    class Config:
        from_attributes = True


# ============ LIGNE COMMANDE ============
class LigneCommandeBase(BaseModel):
    article_id: int
    quantite_demandee: Decimal = Field(..., gt=0, decimal_places=3)
    quantite_livree: Decimal = Field(default=0, ge=0, decimal_places=3)
    unite_mesure: UniteMesure
    prix_unitaire: Optional[Decimal] = Field(None, ge=0, decimal_places=2)


class LigneCommandeCreate(LigneCommandeBase):
    pass


class LigneCommande(LigneCommandeBase):
    id: int
    commande_id: int
    article: Optional[Article] = None

    class Config:
        from_attributes = True


# ============ COMMANDE ============
class CommandeBase(BaseModel):
    client_id: int
    date_livraison_souhaitee: Optional[datetime] = None
    statut: StatutCommande = StatutCommande.EN_ATTENTE
    est_verrouille: bool = True
    paiement_valide: bool = False
    notes: Optional[str] = Field(None, max_length=500)


class CommandeCreate(CommandeBase):
    lignes: List[LigneCommandeCreate] = []
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "client_id": 1,
                "date_livraison_souhaitee": "2026-06-20T14:00:00",
                "statut": "EN_ATTENTE",
                "est_verrouille": True,
                "paiement_valide": False,
                "notes": "Commande urgente pour client VIP",
                "lignes": [
                    {
                        "article_id": 1,
                        "quantite_demandee": 50.0,
                        "quantite_livree": 0.0,
                        "unite_mesure": "UDB",
                        "prix_unitaire": 150000.00
                    }
                ]
            }
        }
    )


class CommandeUpdate(BaseModel):
    date_livraison_souhaitee: Optional[datetime] = None
    statut: Optional[StatutCommande] = None
    est_verrouille: Optional[bool] = None
    paiement_valide: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=500)


class Commande(CommandeBase):
    id: int
    numero_commande: str
    date_commande: datetime
    valide_par: Optional[str] = None
    date_validation: Optional[datetime] = None
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    client: Optional[ClientMagasin] = None
    lignes: List[LigneCommande] = []

    class Config:
        from_attributes = True


# ============ LIGNE BANDE LIVRAISON ============
class LigneBandeLivraisonBase(BaseModel):
    article_id: int
    quantite: Decimal = Field(..., gt=0, decimal_places=3)
    unite_mesure: UniteMesure


class LigneBandeLivraisonCreate(LigneBandeLivraisonBase):
    pass


class LigneBandeLivraison(LigneBandeLivraisonBase):
    id: int
    bande_id: int

    class Config:
        from_attributes = True


# ============ BANDE LIVRAISON ============
class BandeLivraisonBase(BaseModel):
    commande_id: int
    magasin_id: int
    date_livraison: Optional[datetime] = None
    statut: str = Field(default="EN_PREPARATION", max_length=20)
    nombre_camions: int = Field(default=0, ge=0)
    notes: Optional[str] = Field(None, max_length=500)


class BandeLivraisonCreate(BandeLivraisonBase):
    lignes: List[LigneBandeLivraisonCreate] = []
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "commande_id": 1,
                "magasin_id": 1,
                "date_livraison": "2026-06-21T09:00:00",
                "statut": "EN_PREPARATION",
                "nombre_camions": 3,
                "notes": "Livraison avec camions de 20 tonnes",
                "lignes": [
                    {
                        "article_id": 1,
                        "quantite": 25.0,
                        "unite_mesure": "UDB"
                    }
                ]
            }
        }
    )


class BandeLivraisonUpdate(BaseModel):
    date_livraison: Optional[datetime] = None
    statut: Optional[str] = Field(None, max_length=20)
    nombre_camions: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=500)


class BandeLivraison(BandeLivraisonBase):
    id: int
    numero_bande: str
    date_creation: datetime
    prepare_par: Optional[str] = None
    commande: Optional[Commande] = None
    lignes: List[LigneBandeLivraison] = []

    class Config:
        from_attributes = True


# ============ FILTRES STOCK ============
class StockFilter(BaseModel):
    code_article: Optional[str] = None
    nom_article: Optional[str] = None
    magasin_id: Optional[int] = None
    client_id: Optional[int] = None
    date_debut: Optional[datetime] = None
    date_fin: Optional[datetime] = None
