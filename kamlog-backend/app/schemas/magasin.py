# app/schemas/magasin.py - Schémas Pydantic pour le module K-magasin
from pydantic import BaseModel, Field, validator, ConfigDict
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List, Annotated
from enum import Enum

ConstrainedDecimal3 = Annotated[Decimal, Field(ge=0, decimal_places=3)]
ConstrainedDecimal2 = Annotated[Decimal, Field(ge=0, decimal_places=2)]


class UniteMesure(str, Enum):
    """Unités de mesure pour les marchandises"""
    UDB = "UDB"
    KG = "KG"
    TONNE = "TONNE"
    M3 = "M3"
    M2 = "M2"
    UNITE = "UNITE"


class CategorieArticle(str, Enum):
    """Catégories d'articles"""
    ALIMENTAIRE = "ALIMENTAIRE"
    PHARMACEUTIQUE = "PHARMACEUTIQUE"
    MATIERES_PREMIERES = "MATIERES_PREMIERES"
    PRODUITS_FINIS = "PRODUITS_FINIS"
    EMBALLAGES_PALETES = "EMBALLAGES_PALETES"
    EQUIPEMENT = "EQUIPEMENT"
    PIECES_DETACHEES = "PIECES_DETACHEES"
    MOBILIER_BUREAU_INFORMATIQUE = "MOBILIER_BUREAU_INFORMATIQUE"
    PRODUITS_DANGEREUX = "PRODUITS_DANGEREUX"
    PRODUITS_LUXE_VALEUR = "PRODUITS_LUXE_VALEUR"
    VRAC = "VRAC"
    HORS_GABARIT = "HORS_GABARIT"


class StatutStock(str, Enum):
    """Statuts du stock"""
    NORMAL = "NORMAL"
    DECHIRE = "DECHIRE"
    MOUILLE = "MOUILLE"
    ENDOMMAGE = "ENDOMMAGE"
    PERIME = "PERIME"
    EN_ATTENTE = "EN_ATTENTE"
    RESERVE = "RESERVE"


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
    model_config = ConfigDict(from_attributes=True)


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
    model_config = ConfigDict(from_attributes=True)


# ============ ARTICLE ============
class ArticleBase(BaseModel):
    code_article: Optional[str] = Field(None, max_length=20)
    nom: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    categorie: Optional[CategorieArticle] = None
    unite_mesure: UniteMesure = UniteMesure.UDB
    poids_unitaire: Optional[float] = Field(None, ge=0)
    volume_unitaire: Optional[float] = Field(None, ge=0)
    est_actif: bool = True
    proprietes_dynamiques: Optional[dict] = Field(default_factory=dict)


class ArticleCreate(ArticleBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code_article": "1111110",
                "nom": "Gobelet",
                "description": "Gobelet en plastique",
                "categorie": "EMBALLAGES_PALETES",
                "unite_mesure": "UDB",
                "poids_unitaire": 0.005,
                "volume_unitaire": 0.0005,
                "est_actif": True
            }
        }
    )


class ArticleUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    categorie: Optional[CategorieArticle] = None
    unite_mesure: Optional[UniteMesure] = None
    poids_unitaire: Optional[float] = Field(None, ge=0)
    volume_unitaire: Optional[float] = Field(None, ge=0)
    est_actif: Optional[bool] = None


class Article(ArticleBase):
    id: int
    date_creation: datetime
    date_modification: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# ============ LIGNE DECLARATION ============
class LigneDeclarationBase(BaseModel):
    article_id: int
    quantite_declaree: Decimal = Field(..., gt=0, decimal_places=3)
    unite_mesure: UniteMesure
    quantite_udb: Optional[ConstrainedDecimal3] = None
    numero_lot: Optional[str] = None
    date_fabrication: Optional[date] = None
    date_expiration: Optional[date] = None


class LigneDeclarationCreate(LigneDeclarationBase):
    pass


class LigneDeclaration(LigneDeclarationBase):
    id: int
    declaration_id: int
    article: Optional[Article] = None
    model_config = ConfigDict(from_attributes=True)


# ============ MODE FRET ============
class ModeFret(str, Enum):
    """Mode de paiement du fret"""
    PREPAID = "PREPAID"
    COLLECT = "COLLECT"


# ============ STATUT ORDRE TRANSFERT ============
class StatutOrdreTransfert(str, Enum):
    """Cycle de vie d'un Ordre de Transfert"""
    BROUILLON = "BROUILLON"
    VALIDE = "VALIDE"
    EN_TRANSIT = "EN_TRANSIT"
    RECEPTIONNE = "RECEPTIONNE"
    ANNULE = "ANNULE"


# ============ DECLARATION (BILL OF LADING) ============
class DeclarationBase(BaseModel):
    client_id: int
    code_article: str = Field(..., max_length=20)
    incoterm_id: Optional[int] = None
    type_conteneur_id: Optional[int] = None
    numero_conteneur: Optional[str] = Field(None, max_length=50)
    date_arrivee_prevue: Optional[datetime] = None
    statut: StatutDeclaration = StatutDeclaration.BROUILLON
    notes: Optional[str] = Field(None, max_length=500)

    # ── Enrichissement BL Maritime ──
    # Identification & Traçabilité
    numero_bl_externe: Optional[str] = Field(None, max_length=50, description="Vrai numéro BL du document maritime")
    reference_booking: Optional[str] = Field(None, max_length=50, description="Référence booking compagnie maritime")
    numero_scelle: Optional[str] = Field(None, max_length=50, description="Numéro de scellé du conteneur")

    # Liaison Navire
    escale_id: Optional[int] = None
    nom_navire: Optional[str] = Field(None, max_length=100, description="Nom du navire")
    numero_voyage: Optional[str] = Field(None, max_length=50, description="Numéro du voyage")

    # Parties prenantes
    expediteur_shipper: Optional[str] = Field(None, max_length=200, description="Expéditeur (Shipper)")
    destinataire_consignee: Optional[str] = Field(None, max_length=200, description="Destinataire (Consignee)")
    notify_party: Optional[str] = Field(None, max_length=200, description="Partie à notifier")

    # Logistique & Ports
    port_chargement: Optional[str] = Field(None, max_length=100, description="Port of Loading")
    port_dechargement: Optional[str] = Field(None, max_length=100, description="Port of Discharge")
    lieu_livraison: Optional[str] = Field(None, max_length=200, description="Lieu de livraison finale")
    description_marchandises: Optional[str] = Field(None, max_length=1000, description="Description détaillée")

    # Poids, volumes, conditionnement
    poids_brut_kg: Optional[Decimal] = Field(None, ge=0, description="Poids brut en kg")
    poids_net_kg: Optional[Decimal] = Field(None, ge=0, description="Poids net en kg")
    volume_m3: Optional[Decimal] = Field(None, ge=0, description="Volume en m³")
    nombre_colis: Optional[int] = Field(None, ge=0, description="Nombre de colis")
    type_emballage: Optional[str] = Field(None, max_length=100, description="Type d'emballage")

    # Données commerciales & douanières
    mode_fret: Optional[ModeFret] = None
    code_hs: Optional[str] = Field(None, max_length=10, description="Code HS douanier")
    numero_declaration_douane: Optional[str] = Field(None, max_length=50, description="Numéro déclaration SYDONIA")


class DeclarationCreate(DeclarationBase):
    lignes: List[LigneDeclarationCreate] = []
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "client_id": 1,
                "code_article": "1111110",
                "incoterm_id": 1,
                "type_conteneur_id": 1,
                "numero_conteneur": "MSKU1234567",
                "date_arrivee_prevue": "2026-06-15T10:00:00",
                "statut": "BROUILLON",
                "notes": "Déclaration de riz en provenance de Thaïlande",
                "numero_bl_externe": "MAEU123456789",
                "reference_booking": "BK-2026-001",
                "numero_scelle": "SC-789456",
                "nom_navire": "MSC FANTASIA",
                "numero_voyage": "V-2026-A",
                "expediteur_shipper": "Thai Rice Export Co., Ltd.",
                "destinataire_consignee": "KAMLOG Logistics SARL",
                "notify_party": "Transit Express Cameroun",
                "port_chargement": "Bangkok",
                "port_dechargement": "Douala",
                "lieu_livraison": "Magasin KAMLOG Douala",
                "description_marchandises": "Riz blanc parfumé 50kg x 400 sacs",
                "poids_brut_kg": 20500.000,
                "poids_net_kg": 20000.000,
                "volume_m3": 32.500,
                "nombre_colis": 400,
                "type_emballage": "Sacs de 50kg",
                "mode_fret": "PREPAID",
                "code_hs": "1006.30",
                "lignes": [
                    {
                        "article_id": 1,
                        "quantite_declaree": 400.0,
                        "unite_mesure": "UDB"
                    }
                ]
            }
        }
    )


class DeclarationUpdate(BaseModel):
    incoterm_id: Optional[int] = None
    type_conteneur_id: Optional[int] = None
    numero_conteneur: Optional[str] = Field(None, max_length=50)
    date_arrivee_prevue: Optional[datetime] = None
    statut: Optional[StatutDeclaration] = None
    notes: Optional[str] = Field(None, max_length=500)
    # Champs BL enrichis (tous optionnels en update)
    numero_bl_externe: Optional[str] = Field(None, max_length=50)
    reference_booking: Optional[str] = Field(None, max_length=50)
    numero_scelle: Optional[str] = Field(None, max_length=50)
    escale_id: Optional[int] = None
    nom_navire: Optional[str] = Field(None, max_length=100)
    numero_voyage: Optional[str] = Field(None, max_length=50)
    expediteur_shipper: Optional[str] = Field(None, max_length=200)
    destinataire_consignee: Optional[str] = Field(None, max_length=200)
    notify_party: Optional[str] = Field(None, max_length=200)
    port_chargement: Optional[str] = Field(None, max_length=100)
    port_dechargement: Optional[str] = Field(None, max_length=100)
    lieu_livraison: Optional[str] = Field(None, max_length=200)
    description_marchandises: Optional[str] = Field(None, max_length=1000)
    poids_brut_kg: Optional[Decimal] = Field(None, ge=0)
    poids_net_kg: Optional[Decimal] = Field(None, ge=0)
    volume_m3: Optional[Decimal] = Field(None, ge=0)
    nombre_colis: Optional[int] = Field(None, ge=0)
    type_emballage: Optional[str] = Field(None, max_length=100)
    mode_fret: Optional[ModeFret] = None
    code_hs: Optional[str] = Field(None, max_length=10)
    numero_declaration_douane: Optional[str] = Field(None, max_length=50)


class Declaration(DeclarationBase):
    id: int
    numero_bl: str
    date_declaration: datetime
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    client: Optional[ClientMagasin] = None
    lignes: List[LigneDeclaration] = []
    model_config = ConfigDict(from_attributes=True)



# ============ LIGNE RECEPTION ============
class LigneReceptionBase(BaseModel):
    article_id: int
    quantite_recue: Decimal = Field(..., gt=0, decimal_places=3)
    unite_mesure: UniteMesure
    quantite_udb: Optional[ConstrainedDecimal3] = None


class LigneReceptionCreate(LigneReceptionBase):
    pass


class LigneReception(LigneReceptionBase):
    id: int
    reception_id: int
    article: Optional[Article] = None
    model_config = ConfigDict(from_attributes=True)


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
    model_config = ConfigDict(from_attributes=True)


# ============ STOCK ============
class StockBase(BaseModel):
    magasin_id: int
    article_id: int
    quantite_disponible: Decimal = Field(default=0, ge=0, decimal_places=3)
    quantite_udb: Decimal = Field(default=0, ge=0, decimal_places=3)
    statut: StatutStock = StatutStock.NORMAL


class StockCreate(StockBase):
    pass


class StockUpdate(BaseModel):
    quantite_disponible: Optional[ConstrainedDecimal3] = None
    quantite_udb: Optional[ConstrainedDecimal3] = None
    statut: Optional[StatutStock] = None


class Stock(StockBase):
    id: int
    derniere_maj: Optional[datetime] = None
    date_creation: datetime
    magasin: Optional[Magasin] = None
    article: Optional[Article] = None
    model_config = ConfigDict(from_attributes=True)


# ============ FILTRE STOCK ============
class StockFilter(BaseModel):
    """Filtres avancés pour la recherche de stock"""
    code_article: Optional[str] = None
    magasin_ids: Optional[List[int]] = None  # Peut choisir plusieurs magasins
    client_id: Optional[int] = None
    date_debut: Optional[datetime] = None
    date_fin: Optional[datetime] = None
    statut: Optional[StatutStock] = None
    categorie: Optional[CategorieArticle] = None
    article: Optional[Article] = None
    model_config = ConfigDict(from_attributes=True)


# ============ LIGNE COMMANDE ============
class LigneCommandeBase(BaseModel):
    article_id: int
    quantite_demandee: Decimal = Field(..., gt=0, decimal_places=3)
    quantite_livree: Decimal = Field(default=0, ge=0, decimal_places=3)
    unite_mesure: UniteMesure
    prix_unitaire: Optional[ConstrainedDecimal2] = None


class LigneCommandeCreate(LigneCommandeBase):
    pass


class LigneCommande(LigneCommandeBase):
    id: int
    commande_id: int
    article: Optional[Article] = None
    model_config = ConfigDict(from_attributes=True)


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
    model_config = ConfigDict(from_attributes=True)


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
    model_config = ConfigDict(from_attributes=True)


# ============ BANDE LIVRAISON ============
class BandeLivraisonBase(BaseModel):
    commande_id: Optional[int] = None
    ordre_transfert_id: Optional[int] = None
    magasin_id: int
    date_livraison: Optional[datetime] = None
    statut: str = Field(default="EN_PREPARATION", max_length=20)
    nombre_camions: int = Field(default=0, ge=0)
    notes: Optional[str] = Field(None, max_length=500)
    # Transport detail fields
    chauffeur_nom: Optional[str] = Field(None, max_length=200)
    matricule_vehicule: Optional[str] = Field(None, max_length=50)
    signature_chauffeur: Optional[str] = Field(None, max_length=500)
    signature_magasinier: Optional[str] = Field(None, max_length=500)
    signature_transporteur: Optional[str] = Field(None, max_length=500)


class BandeLivraisonCreate(BandeLivraisonBase):
    lignes: List[LigneBandeLivraisonCreate] = []

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ordre_transfert_id": 1,
                "magasin_id": 2,
                "date_livraison": "2026-06-21T09:00:00",
                "statut": "EN_PREPARATION",
                "nombre_camions": 3,
                "notes": "Livraison avec camions de 20 tonnes",
                "chauffeur_nom": "Jean Dupont",
                "matricule_vehicule": "LT-123-AB",
                "signature_chauffeur": "signature_chauffeur_data",
                "signature_magasinier": "signature_magasinier_data",
                "signature_transporteur": "signature_transporteur_data",
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
    # Transport detail fields
    chauffeur_nom: Optional[str] = Field(None, max_length=200)
    matricule_vehicule: Optional[str] = Field(None, max_length=50)
    signature_chauffeur: Optional[str] = Field(None, max_length=500)
    signature_magasinier: Optional[str] = Field(None, max_length=500)
    signature_transporteur: Optional[str] = Field(None, max_length=500)


class BandeLivraison(BandeLivraisonBase):
    id: int
    numero_bande: str
    date_creation: datetime
    prepare_par: Optional[str] = None
    commande: Optional[Commande] = None
    ordre_transfert: Optional["OrdreTransfert"] = None
    magasin: Optional[Magasin] = None
    lignes_bande: List[LigneBandeLivraison] = []
    model_config = ConfigDict(from_attributes=True)


# ============ INCOTERM ============
class IncotermBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=5)
    nom: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    est_actif: bool = True


class IncotermCreate(IncotermBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code": "FOB",
                "nom": "Free On Board",
                "description": "Le vendeur met les marchandises à bord du navire",
                "est_actif": True
            }
        }
    )


class IncotermUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    est_actif: Optional[bool] = None


class Incoterm(IncotermBase):
    id: int
    date_creation: datetime
    model_config = ConfigDict(from_attributes=True)


# ============ TYPE CONTENEUR ============
class TypeConteneurBase(BaseModel):
    code: str = Field(..., min_length=2, max_length=20)
    nom: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    longueur: Optional[str] = Field(None, max_length=10)
    type_conteneur: Optional[str] = Field(None, max_length=50)
    est_actif: bool = True


class TypeConteneurCreate(TypeConteneurBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code": "20DRY",
                "nom": "20' Dry",
                "description": "Conteneur sec 20 pieds",
                "longueur": "20'",
                "type_conteneur": "Dry",
                "est_actif": True
            }
        }
    )


class TypeConteneurUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    longueur: Optional[str] = Field(None, max_length=10)
    type_conteneur: Optional[str] = Field(None, max_length=50)
    est_actif: Optional[bool] = None


class TypeConteneur(TypeConteneurBase):
    id: int
    date_creation: datetime
    model_config = ConfigDict(from_attributes=True)


# ============ TRANSACTION ============
class TransactionBase(BaseModel):
    code_transaction: str = Field(..., min_length=2, max_length=10)
    nom: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    interface: str = Field(..., min_length=2, max_length=100)
    role_requis: Optional[str] = Field(None, max_length=50)
    est_actif: bool = True


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code_transaction": "KM24",
                "nom": "Réception marchandise",
                "description": "Réception de marchandises dans un magasin",
                "interface": "reception_create",
                "role_requis": "MAGASINIER",
                "est_actif": True
            }
        }
    )


class TransactionUpdate(BaseModel):
    nom: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    interface: Optional[str] = Field(None, min_length=2, max_length=100)
    role_requis: Optional[str] = Field(None, max_length=50)
    est_actif: Optional[bool] = None


class Transaction(TransactionBase):
    id: int
    date_creation: datetime
    date_modification: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


# ============ OPERATION TRACE ============
class OperationTraceBase(BaseModel):
    numero_ot: str = Field(..., min_length=9, max_length=20)
    type_operation: str = Field(..., min_length=2, max_length=50)
    table_cible: str = Field(..., min_length=2, max_length=100)
    enregistrement_id: int
    utilisateur_id: Optional[int] = None
    donnees_operation: Optional[str] = Field(None, max_length=5000)


class OperationTraceCreate(OperationTraceBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "numero_ot": "780494878",
                "type_operation": "CREATION_ARTICLE",
                "table_cible": "articles",
                "enregistrement_id": 1,
                "utilisateur_id": 1,
                "donnees_operation": '{"code_article": "1111110", "nom": "Gobelet"}'
            }
        }
    )


class OperationTrace(OperationTraceBase):
    id: int
    date_operation: datetime
    est_annule: bool
    date_annulation: Optional[datetime] = None
    annule_par: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# ============ ANNULATION OPERATION ============
class OperationCancelRequest(BaseModel):
    numero_ot: str = Field(..., min_length=9, max_length=20)
    annule_par: str = Field(..., min_length=2, max_length=100)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "numero_ot": "780494878",
                "annule_par": "admin"
            }
        }
    )


# ============ LIGNE ORDRE TRANSFERT ============
class LigneOrdreTransfertBase(BaseModel):
    article_id: int
    quantite: Decimal = Field(..., gt=0, decimal_places=3)
    unite_mesure: UniteMesure


class LigneOrdreTransfertCreate(LigneOrdreTransfertBase):
    pass


class LigneOrdreTransfert(LigneOrdreTransfertBase):
    id: int
    ordre_transfert_id: int
    quantite_recue: Decimal = Field(default=0, ge=0, decimal_places=3)
    article: Optional[Article] = None
    model_config = ConfigDict(from_attributes=True)


# ============ ORDRE DE TRANSFERT ============
class OrdreTransfertBase(BaseModel):
    declaration_id: Optional[int] = None
    magasin_source_id: int
    magasin_dest_id: int
    motif: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = Field(None, max_length=500)
    validation_service_client: bool = False
    paiement_effectue: bool = False


class OrdreTransfertCreate(OrdreTransfertBase):
    lignes: List[LigneOrdreTransfertCreate] = []
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "declaration_id": 1,
                "magasin_source_id": 1,
                "magasin_dest_id": 2,
                "motif": "Rééquilibrage de stock entre magasins",
                "notes": "Transfert urgent demandé par le client",
                "lignes": [
                    {
                        "article_id": 1,
                        "quantite": 100.0,
                        "unite_mesure": "UDB"
                    }
                ]
            }
        }
    )


class OrdreTransfertUpdate(BaseModel):
    motif: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = Field(None, max_length=500)


class OrdreTransfert(OrdreTransfertBase):
    id: int
    numero_ot: str
    statut: StatutOrdreTransfert
    date_transfert: datetime
    date_validation: Optional[datetime] = None
    date_expedition: Optional[datetime] = None
    date_reception: Optional[datetime] = None
    autorise_par: Optional[str] = None
    cree_par: Optional[str] = None
    date_creation: datetime
    date_modification: Optional[datetime] = None
    magasin_source: Optional[Magasin] = None
    magasin_dest: Optional[Magasin] = None
    declaration: Optional[Declaration] = None
    lignes: List[LigneOrdreTransfert] = []
    model_config = ConfigDict(from_attributes=True)

# Rebuild models with forward references
BandeLivraison.model_rebuild()
