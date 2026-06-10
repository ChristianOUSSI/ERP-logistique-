# app/models/magasin.py - Modèles pour le module K-magasin
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Boolean, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base


class UniteMesure(enum.Enum):
    """Unités de mesure pour les marchandises"""
    UDB = "UDB"  # Unité de base (ex: sac)
    KG = "KG"    # Kilogramme
    TONNE = "TONNE"  # Tonne
    M3 = "M3"    # Mètre cube
    M2 = "M2"    # Mètre carré
    UNITE = "UNITE"  # Unité générique


class CategorieArticle(enum.Enum):
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


class StatutStock(enum.Enum):
    """Statuts du stock"""
    NORMAL = "NORMAL"
    DECHIRE = "DECHIRE"
    MOUILLE = "MOUILLE"
    ENDOMMAGE = "ENDOMMAGE"
    PERIME = "PERIME"
    EN_ATTENTE = "EN_ATTENTE"
    RESERVE = "RESERVE"


class StatutDeclaration(enum.Enum):
    """Statuts des déclarations"""
    BROUILLON = "BROUILLON"
    VALIDEE = "VALIDEE"
    ANNULEE = "ANNULEE"


class StatutReception(enum.Enum):
    """Statuts des réceptions"""
    EN_COURS = "EN_COURS"
    COMPLETEE = "COMPLETEE"
    ANNULEE = "ANNULEE"


class StatutCommande(enum.Enum):
    """Statuts des commandes"""
    EN_ATTENTE = "EN_ATTENTE"
    VERROUILLEE = "VERROUILLEE"  # En attente de paiement
    PAYEE = "PAYEE"
    EN_PREPARATION = "EN_PREPARATION"
    PRETE = "PRETE"
    LIVREE = "LIVREE"
    ANNULEE = "ANNULEE"


class Magasin(Base):
    """Modèle pour les magasins"""
    __tablename__ = "magasins"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)
    nom = Column(String(100), nullable=False)
    adresse = Column(String(255))
    ville = Column(String(100))
    pays = Column(String(100), default="Cameroun")
    telephone = Column(String(20))
    email = Column(String(100))
    est_actif = Column(Boolean, default=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    receptions = relationship("Reception", back_populates="magasin")
    stocks = relationship("Stock", back_populates="magasin")


class ClientMagasin(Base):
    """Modèle pour les clients du magasin"""
    __tablename__ = "clients_magasin"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)
    nom = Column(String(100), nullable=False, index=True)
    prenom = Column(String(100))
    raison_sociale = Column(String(200), index=True)
    telephone = Column(String(20))
    email = Column(String(100))
    adresse = Column(String(255))
    ville = Column(String(100))
    pays = Column(String(100), default="Cameroun")
    numero_contribuable = Column(String(50))
    est_actif = Column(Boolean, default=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    declarations = relationship("Declaration", back_populates="client")
    commandes = relationship("Commande", back_populates="client")


class Article(Base):
    """Modèle pour les codes d'article"""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    code_article = Column(String(20), unique=True, nullable=False, index=True)
    nom = Column(String(200), nullable=False, index=True)
    description = Column(String(500))
    categorie = Column(Enum(CategorieArticle), nullable=True)
    unite_mesure = Column(Enum(UniteMesure), default=UniteMesure.UDB)
    poids_unitaire = Column(Float, nullable=True)  # Poids en kg si applicable
    volume_unitaire = Column(Float, nullable=True)  # Volume en m³ si applicable
    est_actif = Column(Boolean, default=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    lignes_declaration = relationship("LigneDeclaration", back_populates="article")
    lignes_reception = relationship("LigneReception", back_populates="article")
    stocks = relationship("Stock", back_populates="article")
    lignes_commande = relationship("LigneCommande", back_populates="article")


class Declaration(Base):
    """Modèle pour les déclarations (Bill of Lading)"""
    __tablename__ = "declarations"

    id = Column(Integer, primary_key=True, index=True)
    numero_bl = Column(String(50), unique=True, nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("clients_magasin.id"), nullable=False)
    incoterm_id = Column(Integer, ForeignKey("incoterms.id"), nullable=True)
    type_conteneur_id = Column(Integer, ForeignKey("types_conteneur.id"), nullable=True)
    numero_conteneur = Column(String(50), nullable=True)
    date_declaration = Column(DateTime(timezone=True), server_default=func.now())
    date_arrivee_prevue = Column(DateTime(timezone=True))
    statut = Column(Enum(StatutDeclaration), default=StatutDeclaration.BROUILLON)
    notes = Column(String(500))
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    client = relationship("ClientMagasin", back_populates="declarations")
    lignes = relationship("LigneDeclaration", back_populates="declaration", cascade="all, delete-orphan")
    receptions = relationship("Reception", back_populates="declaration")


class LigneDeclaration(Base):
    """Modèle pour les lignes de déclaration"""
    __tablename__ = "lignes_declaration"

    id = Column(Integer, primary_key=True, index=True)
    declaration_id = Column(Integer, ForeignKey("declarations.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite_declaree = Column(Numeric(15, 3), nullable=False)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    quantite_udb = Column(Numeric(15, 3), nullable=True)  # Quantité en UDB calculée

    # Relations
    declaration = relationship("Declaration", back_populates="lignes")
    article = relationship("Article", back_populates="lignes_declaration")


class Reception(Base):
    """Modèle pour les réceptions de marchandises"""
    __tablename__ = "receptions"

    id = Column(Integer, primary_key=True, index=True)
    numero_reception = Column(String(50), unique=True, nullable=False, index=True)
    declaration_id = Column(Integer, ForeignKey("declarations.id"), nullable=False)
    magasin_id = Column(Integer, ForeignKey("magasins.id"), nullable=False)
    date_reception = Column(DateTime(timezone=True), server_default=func.now())
    statut = Column(Enum(StatutReception), default=StatutReception.EN_COURS)
    notes = Column(String(500))
    recu_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    declaration = relationship("Declaration", back_populates="receptions")
    magasin = relationship("Magasin", back_populates="receptions")
    lignes = relationship("LigneReception", back_populates="reception", cascade="all, delete-orphan")


class LigneReception(Base):
    """Modèle pour les lignes de réception"""
    __tablename__ = "lignes_reception"

    id = Column(Integer, primary_key=True, index=True)
    reception_id = Column(Integer, ForeignKey("receptions.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite_recue = Column(Numeric(15, 3), nullable=False)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    quantite_udb = Column(Numeric(15, 3), nullable=True)

    # Relations
    reception = relationship("Reception", back_populates="lignes")
    article = relationship("Article", back_populates="lignes_reception")


class Stock(Base):
    """Modèle pour le stock par magasin et article"""
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    magasin_id = Column(Integer, ForeignKey("magasins.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite_disponible = Column(Numeric(15, 3), default=0)
    quantite_udb = Column(Numeric(15, 3), default=0)
    statut = Column(Enum(StatutStock), default=StatutStock.NORMAL)
    derniere_maj = Column(DateTime(timezone=True), onupdate=func.now())
    date_creation = Column(DateTime(timezone=True), server_default=func.now())

    # Relations
    magasin = relationship("Magasin", back_populates="stocks")
    article = relationship("Article", back_populates="stocks")

    # Contrainte d'unicité
    __table_args__ = (
        UniqueConstraint('magasin_id', 'article_id', name='uq_stock_magasin_article'),
        {'extend_existing': True}
    )


class Commande(Base):
    """Modèle pour les commandes clients"""
    __tablename__ = "commandes"

    id = Column(Integer, primary_key=True, index=True)
    numero_commande = Column(String(50), unique=True, nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("clients_magasin.id"), nullable=False)
    date_commande = Column(DateTime(timezone=True), server_default=func.now())
    date_livraison_souhaitee = Column(DateTime(timezone=True))
    statut = Column(Enum(StatutCommande), default=StatutCommande.EN_ATTENTE)
    est_verrouille = Column(Boolean, default=True)  # Cadenas jusqu'au paiement
    paiement_valide = Column(Boolean, default=False)
    notes = Column(String(500))
    valide_par = Column(String(100))
    date_validation = Column(DateTime(timezone=True))
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    client = relationship("ClientMagasin", back_populates="commandes")
    lignes = relationship("LigneCommande", back_populates="commande", cascade="all, delete-orphan")
    bandes_livraison = relationship("BandeLivraison", back_populates="commande")


class LigneCommande(Base):
    """Modèle pour les lignes de commande"""
    __tablename__ = "lignes_commande"

    id = Column(Integer, primary_key=True, index=True)
    commande_id = Column(Integer, ForeignKey("commandes.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite_demandee = Column(Numeric(15, 3), nullable=False)
    quantite_livree = Column(Numeric(15, 3), default=0)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    prix_unitaire = Column(Numeric(15, 2), nullable=True)

    # Relations
    commande = relationship("Commande", back_populates="lignes")
    article = relationship("Article", back_populates="lignes_commande")


class BandeLivraison(Base):
    """Modèle pour les bandes de livraison"""
    __tablename__ = "bandes_livraison"

    id = Column(Integer, primary_key=True, index=True)
    numero_bande = Column(String(50), unique=True, nullable=False, index=True)
    commande_id = Column(Integer, ForeignKey("commandes.id"), nullable=False)
    magasin_id = Column(Integer, ForeignKey("magasins.id"), nullable=False)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_livraison = Column(DateTime(timezone=True))
    statut = Column(String(20), default="EN_PREPARATION")
    nombre_camions = Column(Integer, default=0)
    notes = Column(String(500))
    prepare_par = Column(String(100))

    # Relations
    commande = relationship("Commande", back_populates="bandes_livraison")
    lignes_bande = relationship("LigneBandeLivraison", back_populates="bande", cascade="all, delete-orphan")


class LigneBandeLivraison(Base):
    """Modèle pour les lignes de bande de livraison"""
    __tablename__ = "lignes_bande_livraison"

    id = Column(Integer, primary_key=True, index=True)
    bande_id = Column(Integer, ForeignKey("bandes_livraison.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    quantite = Column(Numeric(15, 3), nullable=False)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)

    # Relations
    bande = relationship("BandeLivraison", back_populates="lignes_bande")


class Incoterm(Base):
    """Modèle pour les Incoterms"""
    __tablename__ = "incoterms"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(5), unique=True, nullable=False, index=True)
    nom = Column(String(100), nullable=False)
    description = Column(String(500))
    est_actif = Column(Boolean, default=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())


class TypeConteneur(Base):
    """Modèle pour les types de conteneurs"""
    __tablename__ = "types_conteneur"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)
    nom = Column(String(100), nullable=False)
    description = Column(String(500))
    longueur = Column(String(10))  # ex: "20'", "40'"
    type_conteneur = Column(String(50))  # ex: "Dry", "Reefer", "Open Top"
    est_actif = Column(Boolean, default=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())


class Transaction(Base):
    """Modèle pour les transactions (codes d'accès aux interfaces)"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    code_transaction = Column(String(10), unique=True, nullable=False, index=True)
    nom = Column(String(200), nullable=False)
    description = Column(String(500))
    interface = Column(String(100), nullable=False)  # Nom de l'interface/route
    role_requis = Column(String(50))  # Rôle requis pour accéder (ex: "MAGASINIER", "TRANSITAIRE")
    est_actif = Column(Boolean, default=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())


class OperationTrace(Base):
    """Modèle pour tracer les opérations avec numéro d'OT"""
    __tablename__ = "operations_trace"

    id = Column(Integer, primary_key=True, index=True)
    numero_ot = Column(String(20), unique=True, nullable=False, index=True)
    type_operation = Column(String(50), nullable=False)  # ex: "CREATION_ARTICLE", "RECEPTION", "DECLARATION"
    table_cible = Column(String(100), nullable=False)  # Nom de la table concernée
    enregistrement_id = Column(Integer, nullable=False)  # ID de l'enregistrement
    utilisateur_id = Column(Integer, nullable=True)
    date_operation = Column(DateTime(timezone=True), server_default=func.now())
    est_annule = Column(Boolean, default=False)
    date_annulation = Column(DateTime(timezone=True), nullable=True)
    annule_par = Column(String(100), nullable=True)
    donnees_operation = Column(String(5000))  # JSON des données de l'opération
