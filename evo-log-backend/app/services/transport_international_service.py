"""Transport International service - Road transport for Cameroon/CEMAC"""
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.transport_international import (
    OrdreTransport, CarnetTIR, CMR, ScelleRoutier, PositionTransport,
    CETSuivi, AssuranceFAP, PlanningLivraison, PreuveLivraison,
    IncidentTransport, ControleRoutier, TaxeRoutiere, CorridorCEMAC,
    TypeTransitRoutier, StatutTransport
)


class OrdreTransportService:
    """Transport order service"""
    
    @staticmethod
    def creer_ordre_transport(
        db: Session,
        numero_ot: str,
        client_id: int,
        transporteur_id: int,
        camion_id: int,
        conducteur_id: int,
        type_transit: TypeTransitRoutier,
        lieu_chargement: str,
        lieu_livraison: str,
        pays_destination: str,
        code_pays_destination: str,
        marchandise: str,
        poids_net: float,
        poids_brut: float,
        nombre_colis: int,
        valeur_marchandise: float,
        montant_freight: float
    ) -> OrdreTransport:
        """Create transport order"""
        ot = OrdreTransport(
            numero_ot=numero_ot,
            client_id=client_id,
            transporteur_id=transporteur_id,
            camion_id=camion_id,
            conducteur_id=conducteur_id,
            type_transit=type_transit,
            statut=StatutTransport.PLANIFIE,
            date_creation=date.today(),
            lieu_chargement=lieu_chargement,
            lieu_livraison=lieu_livraison,
            pays_destination=pays_destination,
            code_pays_destination=code_pays_destination,
            marchandise=marchandise,
            poids_net=poids_net,
            poids_brut=poids_brut,
            nombre_colis=nombre_colis,
            valeur_marchandise=valeur_marchandise,
            devise="XAF",
            montant_freight=montant_freight
        )
        db.add(ot)
        db.commit()
        db.refresh(ot)
        return ot
    
    @staticmethod
    def mettre_en_transit(db: Session, ot_id: int) -> OrdreTransport:
        """Mark transport as in transit"""
        ot = db.query(OrdreTransport).filter(OrdreTransport.id == ot_id).first()
        if not ot:
            raise ValueError("Ordre de transport non trouvé")
        
        ot.statut = StatutTransport.EN_TRANSIT
        ot.date_chargement_reelle = date.today()
        db.commit()
        db.refresh(ot)
        return ot
    
    @staticmethod
    def marquer_livre(db: Session, ot_id: int) -> OrdreTransport:
        """Mark transport as delivered"""
        ot = db.query(OrdreTransport).filter(OrdreTransport.id == ot_id).first()
        if not ot:
            raise ValueError("Ordre de transport non trouvé")
        
        ot.statut = StatutTransport.LIVRE
        ot.date_livraison_reelle = date.today()
        db.commit()
        db.refresh(ot)
        return ot


class CarnetTIRService:
    """TIR Carnet service"""
    
    @staticmethod
    def creer_carnet_tir(
        db: Session,
        numero_carnet: str,
        ordre_transport_id: int,
        pays_emission: str,
        code_pays_emission: str,
        bureau_depart: str,
        bureau_arrivee: str,
        montant_garantie: float
    ) -> CarnetTIR:
        """Create TIR Carnet"""
        date_validite = date.today() + timedelta(days=365)  # 1 year validity
        
        carnet = CarnetTIR(
            numero_carnet=numero_carnet,
            ordre_transport_id=ordre_transport_id,
            pays_emission=pays_emission,
            code_pays_emission=code_pays_emission,
            date_emission=date.today(),
            date_validite=date_validite,
            bureau_depart=bureau_depart,
            bureau_arrivee=bureau_arrivee,
            montant_garantie=montant_garantie,
            devise="XAF",
            statut="actif"
        )
        db.add(carnet)
        db.commit()
        db.refresh(carnet)
        return carnet


class CMRService:
    """CMR service"""
    
    @staticmethod
    def emettre_cmr(
        db: Session,
        numero_cmr: str,
        ordre_transport_id: int,
        expediteur: str,
        destinataire: str,
        transporteur: str,
        lieu_chargement: str,
        lieu_livraison: str,
        marchandise: str,
        poids_net: float,
        poids_brut: float,
        nombre_colis: int,
        type_emballage: str,
        valeur_marchandise: float
    ) -> CMR:
        """Issue CMR"""
        cmr = CMR(
            numero_cmr=numero_cmr,
            ordre_transport_id=ordre_transport_id,
            expediteur=expediteur,
            destinataire=destinataire,
            transporteur=transporteur,
            lieu_chargement=lieu_chargement,
            lieu_livraison=lieu_livraison,
            date_emission=date.today(),
            marchandise=marchandise,
            poids_net=poids_net,
            poids_brut=poids_brut,
            nombre_colis=nombre_colis,
            type_emballage=type_emballage,
            valeur_marchandise=valeur_marchandise,
            devise="XAF",
            statut="emis"
        )
        db.add(cmr)
        db.commit()
        db.refresh(cmr)
        return cmr
    
    @staticmethod
    def signer_cmr(db: Session, cmr_id: int, type_signature: str) -> CMR:
        """Sign CMR (expediteur, transporteur, destinataire)"""
        cmr = db.query(CMR).filter(CMR.id == cmr_id).first()
        if not cmr:
            raise ValueError("CMR non trouvé")
        
        if type_signature == "expediteur":
            cmr.signature_expediteur = True
        elif type_signature == "transporteur":
            cmr.signature_transporteur = True
        elif type_signature == "destinataire":
            cmr.signature_destinataire = True
            cmr.statut = "livre"
        
        db.commit()
        db.refresh(cmr)
        return cmr


class ScelleRoutierService:
    """Road seal service"""
    
    @staticmethod
    def poser_scelle(
        db: Session,
        numero_scelle: str,
        ordre_transport_id: int,
        type_scelle: str,
        emplacement: str,
        pose_par: str
    ) -> ScelleRoutier:
        """Apply road seal"""
        scelle = ScelleRoutier(
            numero_scelle=numero_scelle,
            ordre_transport_id=ordre_transport_id,
            type_scelle=type_scelle,
            emplacement=emplacement,
            date_pose=datetime.utcnow(),
            pose_par=pose_par,
            statut="pose"
        )
        db.add(scelle)
        db.commit()
        db.refresh(scelle)
        return scelle
    
    @staticmethod
    def verifier_scelle(
        db: Session,
        scelle_id: int,
        verifie_par: str,
        intact: bool,
        motif_bris: str = ""
    ) -> ScelleRoutier:
        """Verify road seal"""
        scelle = db.query(ScelleRoutier).filter(ScelleRoutier.id == scelle_id).first()
        if not scelle:
            raise ValueError("Scellé non trouvé")
        
        scelle.date_verification = datetime.utcnow()
        scelle.verifie_par = verifie_par
        scelle.intact = intact
        scelle.motif_bris = motif_bris
        scelle.statut = "verifie"
        
        db.commit()
        db.refresh(scelle)
        return scelle


class PositionTransportService:
    """Transport position tracking service"""
    
    @staticmethod
    def enregistrer_position(
        db: Session,
        ordre_transport_id: int,
        latitude: float,
        longitude: float,
        vitesse_kmh: float,
        direction: float,
        statut: str = "en_mouvement"
    ) -> PositionTransport:
        """Record transport position"""
        position = PositionTransport(
            ordre_transport_id=ordre_transport_id,
            latitude=latitude,
            longitude=longitude,
            date_position=datetime.utcnow(),
            vitesse_kmh=vitesse_kmh,
            direction=direction,
            statut=statut
        )
        db.add(position)
        db.commit()
        db.refresh(position)
        return position


class CETSuiviService:
    """CET - Control of Exchanges service"""
    
    @staticmethod
    def enregistrer_controle_cet(
        db: Session,
        ordre_transport_id: int,
        numero_cet: str,
        bureau_douane: str,
        type_controle: str,
        resultat: str,
        agent: str,
        fonction: str
    ) -> CETSuivi:
        """Record CET control"""
        cet = CETSuivi(
            ordre_transport_id=ordre_transport_id,
            numero_cet=numero_cet,
            bureau_douane=bureau_douane,
            date_controle=datetime.utcnow(),
            type_controle=type_controle,
            resultat=resultat,
            agent=agent,
            fonction=fonction
        )
        db.add(cet)
        db.commit()
        db.refresh(cet)
        return cet


class AssuranceFAPService:
    """FAP Insurance service"""
    
    @staticmethod
    def creer_assurance_fap(
        db: Session,
        numero_police: str,
        ordre_transport_id: int,
        assureur: str,
        type_couverture: str,
        valeur_assuree: float,
        prime: float,
        franchise: float
    ) -> AssuranceFAP:
        """Create FAP insurance"""
        date_fin = date.today() + timedelta(days=30)  # 30 days coverage
        
        assurance = AssuranceFAP(
            numero_police=numero_police,
            ordre_transport_id=ordre_transport_id,
            assureur=assureur,
            type_couverture=type_couverture,
            valeur_assuree=valeur_assuree,
            devise="XAF",
            prime=prime,
            franchise=franchise,
            date_debut=date.today(),
            date_fin=date_fin,
            statut="actif"
        )
        db.add(assurance)
        db.commit()
        db.refresh(assurance)
        return assurance


class PlanningLivraisonService:
    """Delivery planning service"""
    
    @staticmethod
    def creer_planning(
        db: Session,
        ordre_transport_id: int,
        date_livraison: date,
        heure_debut: str,
        heure_fin: str,
        adresse_livraison: str,
        contact_client: str,
        telephone_client: str,
        poids_decharge: float,
        duree_estimee_heures: float
    ) -> PlanningLivraison:
        """Create delivery planning"""
        planning = PlanningLivraison(
            ordre_transport_id=ordre_transport_id,
            date_livraison=date_livraison,
            heure_debut=heure_debut,
            heure_fin=heure_fin,
            adresse_livraison=adresse_livraison,
            contact_client=contact_client,
            telephone_client=telephone_client,
            poids_decharge=poids_decharge,
            duree_estimee_heures=duree_estimee_heures,
            statut="planifie"
        )
        db.add(planning)
        db.commit()
        db.refresh(planning)
        return planning


class PreuveLivraisonService:
    """Proof of delivery service"""
    
    @staticmethod
    def enregistrer_premiere_livraison(
        db: Session,
        ordre_transport_id: int,
        planning_id: int,
        destinataire: str,
        fonction: str,
        colis_recus: int,
        colis_refuses: int,
        etat_marchandise: str,
        latitude: float,
        longitude: float
    ) -> PreuveLivraison:
        """Record proof of delivery"""
        pod = PreuveLivraison(
            ordre_transport_id=ordre_transport_id,
            planning_id=planning_id,
            date_livraison=datetime.utcnow(),
            destinataire=destinataire,
            fonction=fonction,
            colis_recus=colis_recus,
            colis_refuses=colis_refuses,
            etat_marchandise=etat_marchandise,
            latitude=latitude,
            longitude=longitude,
            statut="signe"
        )
        db.add(pod)
        db.commit()
        db.refresh(pod)
        return pod


class IncidentTransportService:
    """Transport incident service"""
    
    @staticmethod
    def declarer_incident(
        db: Session,
        ordre_transport_id: int,
        type_incident: str,
        date_incident: datetime,
        lieu: str,
        description: str,
        gravite: str
    ) -> IncidentTransport:
        """Declare transport incident"""
        incident = IncidentTransport(
            ordre_transport_id=ordre_transport_id,
            type_incident=type_incident,
            date_incident=date_incident,
            lieu=lieu,
            description=description,
            gravite=gravite,
            statut="ouvert"
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        return incident


class ControleRoutierService:
    """Road control service"""
    
    @staticmethod
    def enregistrer_controle(
        db: Session,
        ordre_transport_id: int,
        type_controle: str,
        date_controle: datetime,
        lieu: str,
        autorite: str,
        resultat: str
    ) -> ControleRoutier:
        """Record road control"""
        controle = ControleRoutier(
            ordre_transport_id=ordre_transport_id,
            type_controle=type_controle,
            date_controle=date_controle,
            lieu=lieu,
            autorite=autorite,
            resultat=resultat
        )
        db.add(controle)
        db.commit()
        db.refresh(controle)
        return controle


class TaxeRoutiereService:
    """Road tax service"""
    
    @staticmethod
    def enregistrer_taxe(
        db: Session,
        ordre_transport_id: int,
        type_taxe: str,
        lieu: str,
        montant: float,
        numero_ticket: str,
        kilometrage: float
    ) -> TaxeRoutiere:
        """Record road tax"""
        taxe = TaxeRoutiere(
            ordre_transport_id=ordre_transport_id,
            type_taxe=type_taxe,
            lieu=lieu,
            date_paiement=datetime.utcnow(),
            montant=montant,
            devise="XAF",
            numero_ticket=numero_ticket,
            kilometrage=kilometrage
        )
        db.add(taxe)
        db.commit()
        db.refresh(taxe)
        return taxe


class CorridorCEMACService:
    """CEMAC Corridor service"""
    
    @staticmethod
    def creer_corridor(
        db: Session,
        nom: str,
        pays_depart: str,
        code_pays_depart: str,
        pays_arrivee: str,
        code_pays_arrivee: str,
        distance_km: float,
        duree_estimee_heures: float
    ) -> CorridorCEMAC:
        """Create CEMAC corridor"""
        corridor = CorridorCEMAC(
            nom=nom,
            pays_depart=pays_depart,
            code_pays_depart=code_pays_depart,
            pays_arrivee=pays_arrivee,
            code_pays_arrivee=code_pays_arrivee,
            distance_km=distance_km,
            duree_estimee_heures=duree_estimee_heures,
            statut="actif"
        )
        db.add(corridor)
        db.commit()
        db.refresh(corridor)
        return corridor


class TransportInternationalReportingService:
    """Transport international reporting service"""
    
    @staticmethod
    def rapport_transport(db: Session, ot_id: int) -> Dict[str, Any]:
        """Generate transport report"""
        ot = db.query(OrdreTransport).filter(OrdreTransport.id == ot_id).first()
        if not ot:
            raise ValueError("Ordre de transport non trouvé")
        
        positions = db.query(PositionTransport).filter(
            PositionTransport.ordre_transport_id == ot_id
        ).all()
        
        controles = db.query(ControleRoutier).filter(
            ControleRoutier.ordre_transport_id == ot_id
        ).all()
        
        incidents = db.query(IncidentTransport).filter(
            IncidentTransport.ordre_transport_id == ot_id
        ).all()
        
        return {
            "ordre_transport": {
                "numero": ot.numero_ot,
                "statut": ot.statut.value,
                "client_id": ot.client_id,
                "destination": ot.lieu_livraison,
                "pays": ot.pays_destination
            },
            "suivi": {
                "positions": len(positions),
                "controles": len(controles),
                "incidents": len(incidents)
            }
        }
