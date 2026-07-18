# app/models/magasin.py - Modèles pour le module K-magasin
from sqlalchemy import Column, Integer, String, Numeric(18, 4), DateTime, ForeignKey, Enum, Boolean, Numeric, UniqueConstraint, JSON, Text, CheckConstraint, Date
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
    capacite_max_m3 = Column(Numeric(18, 4), nullable=True, default=1000.0)
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
    poids_unitaire = Column(Numeric(18, 4), nullable=True)  # Poids en kg si applicable
    volume_unitaire = Column(Numeric(18, 4), nullable=True)  # Volume en m³ si applicable
    est_actif = Column(Boolean, default=True)
    valeur_unitaire = Column(Numeric(18, 4), nullable=True, default=0.0)
    proprietes_dynamiques = Column(JSON, nullable=True, comment="Variables libres dynamiques (Température, HS Code...)")
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    lignes_declaration = relationship("LigneDeclaration", back_populates="article")
    lignes_reception = relationship("LigneReception", back_populates="article")
    stocks = relationship("Stock", back_populates="article")
    lignes_commande = relationship("LigneCommande", back_populates="article")


class ModeFret(enum.Enum):
    """Mode de paiement du fret"""
    PREPAID = "PREPAID"
    COLLECT = "COLLECT"


class StatutOrdreTransfert(enum.Enum):
    """Cycle de vie d'un Ordre de Transfert"""
    BROUILLON = "BROUILLON"
    VALIDE = "VALIDE"
    EN_TRANSIT = "EN_TRANSIT"
    RECEPTIONNE = "RECEPTIONNE"
    ANNULE = "ANNULE"


class Declaration(Base):
    """Modèle pour les déclarations (Bill of Lading) — Connaissement maritime complet"""
    __tablename__ = "declarations"

    id = Column(Integer, primary_key=True, index=True)
    numero_bl = Column(String(50), unique=True, nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("clients_magasin.id", ondelete="CASCADE"), nullable=False)
    incoterm_id = Column(Integer, ForeignKey("incoterms.id", ondelete="CASCADE"), nullable=True)
    type_conteneur_id = Column(Integer, ForeignKey("types_conteneur.id", ondelete="CASCADE"), nullable=True)
    # Code article remplace numero_conteneur comme clé principale pour la marchandise
    code_article = Column(String(20), nullable=False, index=True, comment="Code article principal de la déclaration")
    numero_conteneur = Column(String(50), nullable=True, comment="Numéro conteneur (optionnel)")
    date_declaration = Column(DateTime(timezone=True), server_default=func.now())
    date_arrivee_prevue = Column(DateTime(timezone=True))
    statut = Column(Enum(StatutDeclaration), default=StatutDeclaration.BROUILLON)
    notes = Column(String(500))
    cree_par = Column(String(100))
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())

    # ── ENRICHISSEMENT BL MARITIME ────────────────────────────────
    # Identification & Traçabilité
    numero_bl_externe = Column(String(50), nullable=True, index=True,
        comment="Vrai numéro BL du document maritime (compagnie)")
    reference_booking = Column(String(50), nullable=True,
        comment="Référence de réservation auprès de la compagnie maritime")
    numero_scelle = Column(String(50), nullable=True,
        comment="Numéro de scellé du conteneur")

    # Liaison Navire / Escale
    escale_id = Column(Integer, ForeignKey("escales.id", ondelete="CASCADE"), nullable=True,
        comment="Liaison vers l'escale du navire")
    nom_navire = Column(String(100), nullable=True,
        comment="Nom du navire (texte libre si pas d'escale liée)")
    numero_voyage = Column(String(50), nullable=True,
        comment="Numéro du voyage")

    # Parties prenantes
    expediteur_shipper = Column(String(200), nullable=True,
        comment="Expéditeur (Shipper) — celui qui expédie")
    destinataire_consignee = Column(String(200), nullable=True,
        comment="Destinataire (Consignee) — celui qui reçoit")
    notify_party = Column(String(200), nullable=True,
        comment="Partie à notifier à l'arrivée")

    # Logistique & Ports
    port_chargement = Column(String(100), nullable=True,
        comment="Port of Loading")
    port_dechargement = Column(String(100), nullable=True,
        comment="Port of Discharge")
    lieu_livraison = Column(String(200), nullable=True,
        comment="Place of Delivery (destination finale)")
    description_marchandises = Column(String(1000), nullable=True,
        comment="Description détaillée des marchandises sur le BL")

    # Poids, volumes, conditionnement
    poids_brut_kg = Column(Numeric(12, 3), nullable=True,
        comment="Poids brut déclaré en kg")
    poids_net_kg = Column(Numeric(12, 3), nullable=True,
        comment="Poids net déclaré en kg")
    volume_m3 = Column(Numeric(18, 4), nullable=True,
        comment="Volume en mètres cubes")
    nombre_colis = Column(Integer, nullable=True,
        comment="Nombre de colis / emballages")
    type_emballage = Column(String(100), nullable=True,
        comment="Type d'emballage (sacs, cartons, palettes…)")

    # Données commerciales & douanières
    mode_fret = Column(Enum(ModeFret), nullable=True,
        comment="Prepaid ou Collect")
    code_hs = Column(String(10), nullable=True,
        comment="Code douanier du Système Harmonisé")
    numero_declaration_douane = Column(String(50), nullable=True,
        comment="Numéro de déclaration douanière (SYDONIA)")

    # Relations
    client = relationship("ClientMagasin", back_populates="declarations")
    lignes = relationship("LigneDeclaration", back_populates="declaration", cascade="all, delete-orphan")
    receptions = relationship("Reception", back_populates="declaration")
    escale = relationship("Escale", backref="declarations")
    ordres_transfert = relationship("OrdreTransfert", back_populates="declaration")


class LigneDeclaration(Base):
    """Modèle pour les lignes de déclaration"""
    __tablename__ = "lignes_declaration"

    id = Column(Integer, primary_key=True, index=True)
    declaration_id = Column(Integer, ForeignKey("declarations.id", ondelete="CASCADE"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    quantite_declaree = Column(Numeric(15, 3), nullable=False)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    quantite_udb = Column(Numeric(15, 3), nullable=True)  # Quantité en UDB calculée
    quantite_recue = Column(Numeric(15, 3), default=0, comment="Quantité totale reçue (tous magasins)")
    quantite_restante = Column(Numeric(15, 3), nullable=True, comment="Quantité restante à recevoir (calculée)")
    
    # Nouveaux champs pour le vrac / sacs
    numero_lot = Column(String(100), nullable=True, comment="Numéro de lot pour traçabilité")
    date_fabrication = Column(Date, nullable=True)
    date_expiration = Column(Date, nullable=True)

    # Relations
    declaration = relationship("Declaration", back_populates="lignes")
    article = relationship("Article", back_populates="lignes_declaration")


class Reception(Base):
    """Modèle pour les réceptions de marchandises"""
    __tablename__ = "receptions"

    id = Column(Integer, primary_key=True, index=True)
    numero_reception = Column(String(50), unique=True, nullable=False, index=True)
    declaration_id = Column(Integer, ForeignKey("declarations.id", ondelete="CASCADE"), nullable=False)
    magasin_id = Column(Integer, ForeignKey("magasins.id", ondelete="CASCADE"), nullable=False)
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
    reception_id = Column(Integer, ForeignKey("receptions.id", ondelete="CASCADE"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    quantite_recue = Column(Numeric(15, 3), nullable=False)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    quantite_udb = Column(Numeric(15, 3), nullable=True)

    # Nouveaux champs pour le vrac / sacs
    numero_lot = Column(String(100), nullable=True, comment="Numéro de lot réceptionné")
    date_fabrication = Column(Date, nullable=True)
    date_expiration = Column(Date, nullable=True)

    # Relations
    reception = relationship("Reception", back_populates="lignes")
    article = relationship("Article", back_populates="lignes_reception")


class Stock(Base):
    """Modèle pour le stock par magasin et article"""
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    magasin_id = Column(Integer, ForeignKey("magasins.id", ondelete="CASCADE"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
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
    client_id = Column(Integer, ForeignKey("clients_magasin.id", ondelete="CASCADE"), nullable=False)
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
    commande_id = Column(Integer, ForeignKey("commandes.id", ondelete="CASCADE"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    quantite_demandee = Column(Numeric(15, 3), nullable=False)
    quantite_livree = Column(Numeric(15, 3), default=0)
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    prix_unitaire = Column(Numeric(18, 4), nullable=True)

    # Relations
    commande = relationship("Commande", back_populates="lignes")
    article = relationship("Article", back_populates="lignes_commande")


class BandeLivraison(Base):
    """Modèle pour les bandes de livraison"""
    __tablename__ = "bandes_livraison"

    id = Column(Integer, primary_key=True, index=True)
    numero_bande = Column(String(50), unique=True, nullable=False, index=True)
    commande_id = Column(Integer, ForeignKey("commandes.id", ondelete="CASCADE"), nullable=True)
    ordre_transfert_id = Column(Integer, ForeignKey("ordres_transfert.id", ondelete="CASCADE"), nullable=True)
    magasin_id = Column(Integer, ForeignKey("magasins.id", ondelete="CASCADE"), nullable=False)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_livraison = Column(DateTime(timezone=True))
    statut = Column(String(20), default="EN_PREPARATION")
    nombre_camions = Column(Integer, default=0)
    notes = Column(String(500))
    prepare_par = Column(String(100))
    # Transport detail fields
    chauffeur_nom = Column(String(200))
    matricule_vehicule = Column(String(50))
    signature_chauffeur = Column(Text)
    signature_magasinier = Column(Text)
    signature_transporteur = Column(Text)

    # Constraint: either commande_id OR ordre_transfert_id must be set (not both, not neither)
    __table_args__ = (
        CheckConstraint(
            "(commande_id IS NULL AND ordre_transfert_id IS NOT NULL) OR "
            "(commande_id IS NOT NULL AND ordre_transfert_id IS NULL)",
            name="check_bande_livraison_commande_or_ordre_transfert"
        ),
    )

    # Relations
    commande = relationship("Commande", back_populates="bandes_livraison")
    ordre_transfert = relationship("OrdreTransfert", back_populates="bandes_livraison")
    lignes_bande = relationship("LigneBandeLivraison", back_populates="bande", cascade="all, delete-orphan")


class LigneBandeLivraison(Base):
    """Modèle pour les lignes de bande de livraison"""
    __tablename__ = "lignes_bande_livraison"

    id = Column(Integer, primary_key=True, index=True)
    bande_id = Column(Integer, ForeignKey("bandes_livraison.id", ondelete="CASCADE"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
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


class OrdreTransfert(Base):
    """
    Ordre de Transfert inter-magasins.
    Permet de déplacer des marchandises d'un magasin source vers un magasin destination.
    Lié au BL d'origine pour la traçabilité.
    Cycle : BROUILLON → VALIDE (déstockage source) → EN_TRANSIT → RECEPTIONNE (stockage dest) → ou ANNULE
    """
    __tablename__ = "ordres_transfert"

    id = Column(Integer, primary_key=True, index=True)
    numero_ot = Column(String(30), unique=True, nullable=False, index=True,
        comment="Format: OT-2026-0001")

    # Liaison vers la déclaration BL d'origine (traçabilité)
    declaration_id = Column(Integer, ForeignKey("declarations.id", ondelete="SET NULL"), nullable=True,
        comment="BL de référence pour la traçabilité")

    # Magasins source et destination
    magasin_source_id = Column(Integer, ForeignKey("magasins.id", ondelete="CASCADE"), nullable=False,
        comment="Magasin d'où partent les marchandises")
    magasin_dest_id = Column(Integer, ForeignKey("magasins.id", ondelete="CASCADE"), nullable=False,
        comment="Magasin de destination")

    # Dates et statut
    date_transfert = Column(DateTime(timezone=True), server_default=func.now(),
        comment="Date de création de l'OT")
    date_validation = Column(DateTime(timezone=True), nullable=True,
        comment="Date de validation (déstockage source)")
    date_expedition = Column(DateTime(timezone=True), nullable=True,
        comment="Date d'expédition physique")
    date_reception = Column(DateTime(timezone=True), nullable=True,
        comment="Date de réception au magasin destination")
    statut = Column(Enum(StatutOrdreTransfert), default=StatutOrdreTransfert.BROUILLON,
        nullable=False, index=True)

    # Détails opérationnels
    motif = Column(String(500), nullable=True,
        comment="Motif / raison du transfert")
    autorise_par = Column(String(100), nullable=True)
    notes = Column(String(500), nullable=True)
    cree_par = Column(String(100), nullable=True)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Nouveaux verrous Customer Service
    validation_service_client = Column(Boolean, default=False, comment="Validé par le Service Client")
    paiement_effectue = Column(Boolean, default=False, comment="Paiement vérifié")

    # Relations
    declaration = relationship("Declaration", back_populates="ordres_transfert")
    magasin_source = relationship("Magasin", foreign_keys=[magasin_source_id], backref="ot_sortants")
    magasin_dest = relationship("Magasin", foreign_keys=[magasin_dest_id], backref="ot_entrants")
    lignes = relationship("LigneOrdreTransfert", back_populates="ordre_transfert", cascade="all, delete-orphan")
    bandes_livraison = relationship("BandeLivraison", back_populates="ordre_transfert")


class LigneOrdreTransfert(Base):
    """Ligne d'un Ordre de Transfert — détail article par article"""
    __tablename__ = "lignes_ordre_transfert"

    id = Column(Integer, primary_key=True, index=True)
    ordre_transfert_id = Column(Integer, ForeignKey("ordres_transfert.id", ondelete="CASCADE"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    quantite = Column(Numeric(15, 3), nullable=False,
        comment="Quantité à transférer")
    unite_mesure = Column(Enum(UniteMesure), nullable=False)
    quantite_recue = Column(Numeric(15, 3), default=0,
        comment="Quantité effectivement reçue au magasin destination")

    # Relations
    ordre_transfert = relationship("OrdreTransfert", back_populates="lignes")
    article = relationship("Article")

