"""Acconage service - Complete port operations management for Cameroon/CEMAC"""
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.acconage import (
    Navire, Escale, OperationAcconage, StowagePlan, PositionConteneur,
    Grue, ReservationGrue, Remorqueur, Amarage, Conteneur, Connaissement,
    PackingList, Manifeste, MarchandiseDangereuse, Surestarie, TerminalHandlingCharge, NettoyageCale
)


class StowagePlanService:
    """Stowage plan management service"""
    
    @staticmethod
    def creer_stowage_plan(
        db: Session,
        navire_id: int,
        voyage_id: str,
        plan_pdf_path: str,
        valide_par_id: int
    ) -> StowagePlan:
        """Create stowage plan for container positioning"""
        plan = StowagePlan(
            navire_id=navire_id,
            voyage_id=voyage_id,
            plan_pdf=plan_pdf_path,
            valide=False,
            valide_par=valide_par_id
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)
        return plan
    
    @staticmethod
    def ajouter_position_conteneur(
        db: Session,
        stowage_plan_id: int,
        conteneur_id: int,
        bay: int,
        row: int,
        tier: int,
        poids: float,
        type_marchandise: str,
        port_dechargement: str,
        dangereux: bool = False,
        classe_imdg: Optional[str] = None,
        reefer: bool = False,
        temperature: Optional[float] = None
    ) -> PositionConteneur:
        """Add container position to stowage plan"""
        position = PositionConteneur(
            stowage_plan_id=stowage_plan_id,
            conteneur_id=conteneur_id,
            bay=bay,
            row=row,
            tier=tier,
            poids=poids,
            type_marchandise=type_marchandise,
            port_dechargement=port_dechargement,
            dangereux=dangereux,
            classe_imdg=classe_imdg,
            reefer=reefer,
            temperature=temperature
        )
        db.add(position)
        db.commit()
        db.refresh(position)
        return position
    
    @staticmethod
    def valider_stowage_plan(db: Session, plan_id: int) -> StowagePlan:
        """Validate stowage plan"""
        plan = db.query(StowagePlan).filter(StowagePlan.id == plan_id).first()
        if not plan:
            raise ValueError("Stowage plan non trouvé")
        
        plan.valide = True
        db.commit()
        db.refresh(plan)
        return plan


class GrueService:
    """Crane/handling equipment management service"""
    
    @staticmethod
    def creer_grue(
        db: Session,
        code: str,
        type_grue: str,
        capacite_tonnes: float,
        portee_metres: float,
        hauteur_metres: float,
        poste_quai: str
    ) -> Grue:
        """Create crane equipment"""
        grue = Grue(
            code=code,
            type_grue=type_grue,
            capacite_tonnes=capacite_tonnes,
            portee_metres=portee_metres,
            hauteur_metres=hauteur_metres,
            poste_quai=poste_quai,
            statut="disponible"
        )
        db.add(grue)
        db.commit()
        db.refresh(grue)
        return grue
    
    @staticmethod
    def reserver_grue(
        db: Session,
        grue_id: int,
        operation_id: int,
        date_debut: datetime,
        date_fin: datetime
    ) -> ReservationGrue:
        """Reserve crane for operation"""
        reservation = ReservationGrue(
            grue_id=grue_id,
            operation_id=operation_id,
            date_debut=date_debut,
            date_fin=date_fin,
            statut="reserve"
        )
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation
    
    @staticmethod
    def obtenir_grues_disponibles(
        db: Session,
        date_debut: datetime,
        date_fin: datetime
    ) -> List[Grue]:
        """Get available cranes for time period"""
        # Get cranes not reserved during this period
        grues_reservees = db.query(ReservationGrue.grue_id).filter(
            and_(
                ReservationGrue.statut == "reserve",
                ReservationGrue.date_debut <= date_fin,
                ReservationGrue.date_fin >= date_debut
            )
        ).all()
        
        reserve_ids = [r.grue_id for r in grues_reservees]
        
        return db.query(Grue).filter(
            and_(
                Grue.statut == "disponible",
                ~Grue.id.in_(reserve_ids)
            )
        ).all()


class RemorqueurService:
    """Tugboat management service"""
    
    @staticmethod
    def creer_remorqueur(
        db: Session,
        nom: str,
        puissance_cv: int,
        longueur: float,
        port_id: int
    ) -> Remorqueur:
        """Create tugboat"""
        remorqueur = Remorqueur(
            nom=nom,
            puissance_cv=puissance_cv,
            longueur=longueur,
            port_id=port_id,
            statut="disponible"
        )
        db.add(remorqueur)
        db.commit()
        db.refresh(remorqueur)
        return remorqueur
    
    @staticmethod
    def enregistrer_amarage(
        db: Session,
        escale_id: int,
        remorqueur_id: int,
        type_amarage: str,
        date_debut: datetime,
        date_fin: datetime
    ) -> Amarage:
        """Record berthing operation"""
        duree_heures = (date_fin - date_debut).total_seconds() / 3600
        
        # Calculate cost (simple rate - to be configured)
        taux_horaire = 50000  # XAF per hour
        cout = duree_heures * taux_horaire
        
        amarage = Amarage(
            escale_id=escale_id,
            remorqueur_id=remorqueur_id,
            type_amarage=type_amarage,
            date_debut=date_debut,
            date_fin=date_fin,
            duree_heures=duree_heures,
            cout=cout
        )
        db.add(amarage)
        db.commit()
        db.refresh(amarage)
        return amarage


class ConteneurService:
    """Container management service"""
    
    @staticmethod
    def creer_conteneur(
        db: Session,
        numero: str,
        type_conteneur: str,
        statut: str,
        tare_weight: float,
        gross_weight: float,
        navire_id: Optional[int] = None,
        scelle: Optional[str] = None
    ) -> Conteneur:
        """Create container record"""
        net_weight = gross_weight - tare_weight
        
        conteneur = Conteneur(
            numero=numero,
            type_conteneur=type_conteneur,
            statut=statut,
            tare_weight=tare_weight,
            gross_weight=gross_weight,
            net_weight=net_weight,
            navire_id=navire_id,
            scelle=scelle,
            date_scelle=date.today() if scelle else None
        )
        db.add(conteneur)
        db.commit()
        db.refresh(conteneur)
        return conteneur
    
    @staticmethod
    def enregistrer_inspection_phasanitaire(
        db: Session,
        conteneur_id: int,
        conforme: bool
    ) -> Conteneur:
        """Record phytosanitary inspection"""
        conteneur = db.query(Conteneur).filter(Conteneur.id == conteneur_id).first()
        if not conteneur:
            raise ValueError("Conteneur non trouvé")
        
        conteneur.inspection_phasanitaire = True
        conteneur.date_inspection = date.today()
        
        db.commit()
        db.refresh(conteneur)
        return conteneur


class ConnaissementService:
    """Bill of Lading management service"""
    
    @staticmethod
    def emettre_connaissement(
        db: Session,
        numero_bl: str,
        conteneur_id: int,
        type_bl: str,
        chargeur: str,
        destinataire: str,
        port_embarquement: str,
        port_dechargement: str,
        montant_freight: float,
        escale_id: Optional[int] = None
    ) -> Connaissement:
        """Issue Bill of Lading"""
        bl = Connaissement(
            numero_bl=numero_bl,
            conteneur_id=conteneur_id,
            type_bl=type_bl,
            chargeur=chargeur,
            destinataire=destinataire,
            port_embarquement=port_embarquement,
            port_dechargement=port_dechargement,
            date_emission=date.today(),
            montant_freight=montant_freight,
            devise="XAF",
            statut="emis",
            escale_id=escale_id
        )
        db.add(bl)
        db.commit()
        db.refresh(bl)
        return bl


class PackingListService:
    """Packing List management service"""
    
    @staticmethod
    def creer_packing_list(
        db: Session,
        numero_pl: str,
        conteneur_id: int,
        marchandise: str,
        description: str,
        nombre_colis: int,
        type_colis: str,
        poids_net: float,
        poids_brut: float,
        marque: str,
        pays_origine: str
    ) -> PackingList:
        """Create packing list entry"""
        volume_m3 = (poids_brut / 1000) if poids_brut else 0  # Simplified
        
        pl = PackingList(
            numero_pl=numero_pl,
            conteneur_id=conteneur_id,
            marchandise=marchandise,
            description=description,
            nombre_colis=nombre_colis,
            type_colis=type_colis,
            poids_net=poids_net,
            poids_brut=poids_brut,
            volume_m3=volume_m3,
            marque=marque,
            pays_origine=pays_origine,
            date_emission=date.today()
        )
        db.add(pl)
        db.commit()
        db.refresh(pl)
        return pl


class ManifesteService:
    """Cargo Manifest management service"""
    
    @staticmethod
    def creer_manifeste(
        db: Session,
        numero_manifeste: str,
        escale_id: int,
        type_manifeste: str,
        navire: str,
        voyage: str,
        port_provenance: str,
        port_destination: str,
        nombre_conteneurs: int,
        tonnage_total: float,
        valeur_marchandise: float
    ) -> Manifeste:
        """Create cargo manifest"""
        manifeste = Manifeste(
            numero_manifeste=numero_manifeste,
            escale_id=escale_id,
            type_manifeste=type_manifeste,
            navire=navire,
            voyage=voyage,
            port_provenance=port_provenance,
            port_destination=port_destination,
            nombre_conteneurs=nombre_conteneurs,
            tonnage_total=tonnage_total,
            valeur_marchandise=valeur_marchandise,
            devise="XAF"
        )
        db.add(manifeste)
        db.commit()
        db.refresh(manifeste)
        return manifeste
    
    @staticmethod
    def ajouter_marchandise_dangereuse(
        db: Session,
        manifeste_id: int,
        conteneur_id: int,
        classe_imdg: str,
        numero_onu: str,
        designation: str,
        groupe_emballage: str,
        etiquette: str,
        quantite: float,
        emplacement: str
    ) -> MarchandiseDangereuse:
        """Add dangerous goods declaration"""
        md = MarchandiseDangereuse(
            manifeste_id=manifeste_id,
            conteneur_id=conteneur_id,
            classe_imdg=classe_imdg,
            numero_onu=numero_onu,
            designation=designation,
            groupe_emballage=groupe_emballage,
            etiquette=etiquette,
            quantite=quantite,
            emplacement=emplacement
        )
        db.add(md)
        db.commit()
        db.refresh(md)
        return md


class SurestarieService:
    """Demurrage charges management service"""
    
    @staticmethod
    def calculer_surestarie(
        db: Session,
        conteneur_id: int,
        date_debut: date,
        date_fin: date,
        taux_journalier: float = 5000.0
    ) -> Surestarie:
        """Calculate demurrage charges"""
        nombre_jours = (date_fin - date_debut).days + 1
        montant_total = nombre_jours * taux_journalier
        
        surestarie = Surestarie(
            conteneur_id=conteneur_id,
            date_debut=date_debut,
            date_fin=date_fin,
            nombre_jours=nombre_jours,
            taux_journalier=taux_journalier,
            montant_total=montant_total,
            devise="XAF",
            statut="encours"
        )
        db.add(surestarie)
        db.commit()
        db.refresh(surestarie)
        return surestarie
    
    @staticmethod
    def obtenir_surestaries_encours(db: Session, escale_id: int) -> List[Surestarie]:
        """Get pending demurrage charges for port call"""
        return db.query(Surestarie).filter(
            and_(
                Surestarie.escale_id == escale_id,
                Surestarie.statut == "encours"
            )
        ).all()


class THCService:
    """Terminal Handling Charges service"""
    
    @staticmethod
    def appliquer_thc(
        db: Session,
        conteneur_id: int,
        type_operation: str,
        type_conteneur: str,
        montant: float
    ) -> TerminalHandlingCharge:
        """Apply Terminal Handling Charge"""
        thc = TerminalHandlingCharge(
            conteneur_id=conteneur_id,
            type_operation=type_operation,
            type_conteneur=type_conteneur,
            montant=montant,
            devise="XAF",
            date_application=date.today(),
            statut="facture"
        )
        db.add(thc)
        db.commit()
        db.refresh(thc)
        return thc


class NettoyageCaleService:
    """Hold cleaning service"""
    
    @staticmethod
    def enregistrer_nettoyage(
        db: Session,
        navire_id: int,
        escale_id: int,
        cale_numero: str,
        type_nettoyage: str,
        equipe: str
    ) -> NettoyageCale:
        """Record hold cleaning operation"""
        nettoyage = NettoyageCale(
            navire_id=navire_id,
            escale_id=escale_id,
            cale_numero=cale_numero,
            type_nettoyage=type_nettoyage,
            equipe=equipe,
            date_debut=datetime.utcnow()
        )
        db.add(nettoyage)
        db.commit()
        db.refresh(nettoyage)
        return nettoyage
    
    @staticmethod
    def completer_nettoyage(
        db: Session,
        nettoyage_id: int,
        conforme: bool,
        inspecteur_id: int,
        observations: str = ""
    ) -> NettoyageCale:
        """Complete hold cleaning with inspection"""
        nettoyage = db.query(NettoyageCale).filter(NettoyageCale.id == nettoyage_id).first()
        if not nettoyage:
            raise ValueError("Nettoyage non trouvé")
        
        nettoyage.date_fin = datetime.utcnow()
        nettoyage.conforme = conforme
        nettoyage.inspection_par = inspecteur_id
        nettoyage.date_inspection = datetime.utcnow()
        nettoyage.observations = observations
        
        db.commit()
        db.refresh(nettoyage)
        return nettoyage


class AcconageReportingService:
    """Acconage reporting service"""
    
    @staticmethod
    def rapport_escale(db: Session, escale_id: int) -> Dict[str, Any]:
        """Generate complete port call report"""
        escale = db.query(Escale).filter(Escale.id == escale_id).first()
        if not escale:
            raise ValueError("Escale non trouvée")
        
        operations = db.query(OperationAcconage).filter(
            OperationAcconage.escale_id == escale_id
        ).all()
        
        surestaries = db.query(Surestarie).filter(
            Surestarie.escale_id == escale_id
        ).all()
        
        total_operations = len(operations)
        total_tonnage = sum(op.quantite or 0 for op in operations)
        total_montant = sum(op.montant or 0 for op in operations)
        total_surestaries = sum(s.montant_total or 0 for s in surestaries)
        
        return {
            "escale": {
                "numero": escale.numero_escale,
                "navire": escale.navire.nom if escale.navire else None,
                "date_arrivee": escale.date_arrivee_reelle,
                "date_depart": escale.date_depart_reelle,
                "statut": escale.statut.value
            },
            "operations": {
                "total": total_operations,
                "tonnage": total_tonnage,
                "montant": total_montant
            },
            "surestaries": {
                "total": len(surestaries),
                "montant": total_surestaries
            }
        }
