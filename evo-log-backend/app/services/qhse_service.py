"""QHSE service - Quality, Health, Safety, Environment management for Cameroon/CEMAC"""
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.qhse import (
    AnalyseRisque, ActionPrevention, PlanPrevention, EPIRequis,
    AccidentTravail, InvestigationAccident, NormeCertification, AuditQualite,
    HACCPPlan, PointCritiqueCCP, EnregistrementHACCP, FormationQHSE, IndicateurQHSE,
    TypeRisque, GraviteRisque, TypeEPI, StatutAccident, NormeISO
)


class AnalyseRisqueService:
    """Risk analysis service"""
    
    @staticmethod
    def creer_analyse_risque(
        db: Session,
        numero_analyse: str,
        zone: str,
        processus: str,
        type_risque: TypeRisque,
        description_danger: str,
        causes_potentielles: str,
        consequences: str,
        population_exposee: int,
        frequence: str,
        gravite: GraviteRisque,
        probabilite: int
    ) -> AnalyseRisque:
        """Create risk analysis"""
        # Calculate risk level
        risque_calcule = probabilite * (5 if gravite == GraviteRisque.CATASTROPHIQUE else
                                       4 if gravite == GraviteRisque.CRITIQUE else
                                       3 if gravite == GraviteRisque.MAJEUR else
                                       2 if gravite == GraviteRisque.MODERE else
                                       1 if gravite == GraviteRisque.MINEUR else 0)
        
        if risque_calcule >= 15:
            niveau_risque = "critique"
        elif risque_calcule >= 10:
            niveau_risque = "eleve"
        elif risque_calcule >= 5:
            niveau_risque = "moyen"
        else:
            niveau_risque = "faible"
        
        analyse = AnalyseRisque(
            numero_analyse=numero_analyse,
            zone=zone,
            processus=processus,
            date_analyse=date.today(),
            type_risque=type_risque,
            description_danger=description_danger,
            causes_potentielles=causes_potentielles,
            consequences=consequences,
            population_exposee=population_exposee,
            frequence=frequence,
            gravite=gravite,
            probabilite=probabilite,
            risque_calcule=risque_calcule,
            niveau_risque=niveau_risque,
            statut="actif"
        )
        db.add(analyse)
        db.commit()
        db.refresh(analyse)
        return analyse


class ActionPreventionService:
    """Prevention action service"""
    
    @staticmethod
    def creer_action_prevention(
        db: Session,
        numero_action: str,
        analyse_risque_id: int,
        type_action: str,
        description: str,
        priorite: str,
        responsable: str,
        date_prevue: date
    ) -> ActionPrevention:
        """Create prevention action"""
        action = ActionPrevention(
            numero_action=numero_action,
            analyse_risque_id=analyse_risque_id,
            type_action=type_action,
            description=description,
            priorite=priorite,
            responsable=responsable,
            date_prevue=date_prevue,
            statut="en_attente"
        )
        db.add(action)
        db.commit()
        db.refresh(action)
        return action


class PlanPreventionService:
    """Prevention plan service"""
    
    @staticmethod
    def creer_plan_prevention(
        db: Session,
        numero_plan: str,
        type_activite: str,
        zone: str,
        date_debut: date,
        date_fin: date,
        responsable: str,
        description: str
    ) -> PlanPrevention:
        """Create prevention plan"""
        plan = PlanPrevention(
            numero_plan=numero_plan,
            type_activite=type_activite,
            zone=zone,
            date_debut=date_debut,
            date_fin=date_fin,
            responsable=responsable,
            description=description,
            statut="en_cours"
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)
        return plan


class EPIRequisService:
    """Required PPE service"""
    
    @staticmethod
    def ajouter_epi(
        db: Session,
        plan_prevention_id: int,
        type_epi: TypeEPI,
        designation: str,
        quantite: int,
        norme: str
    ) -> EPIRequis:
        """Add required PPE"""
        epi = EPIRequis(
            plan_prevention_id=plan_prevention_id,
            type_epi=type_epi,
            designation=designation,
            quantite=quantite,
            norme=norme,
            statut="disponible"
        )
        db.add(epi)
        db.commit()
        db.refresh(epi)
        return epi


class AccidentTravailService:
    """Work accident service"""
    
    @staticmethod
    def declarer_accident(
        db: Session,
        numero_accident: str,
        employe_id: int,
        date_accident: datetime,
        lieu: str,
        type_accident: str,
        description: str,
        gravite: str
    ) -> AccidentTravail:
        """Declare work accident"""
        accident = AccidentTravail(
            numero_accident=numero_accident,
            employe_id=employe_id,
            date_accident=date_accident,
            lieu=lieu,
            type_accident=type_accident,
            description=description,
            gravite=gravite,
            statut=StatutAccident.SIGNALE,
            date_declaration=date.today()
        )
        db.add(accident)
        db.commit()
        db.refresh(accident)
        return accident


class InvestigationAccidentService:
    """Accident investigation service"""
    
    @staticmethod
    def creer_investigation(
        db: Session,
        accident_id: int,
        numero_investigation: str,
        date_investigation: date,
        investigateur: str
    ) -> InvestigationAccident:
        """Create accident investigation"""
        investigation = InvestigationAccident(
            accident_id=accident_id,
            numero_investigation=numero_investigation,
            date_investigation=date_investigation,
            investigateur=investigateur,
            statut="en_cours"
        )
        db.add(investigation)
        db.commit()
        db.refresh(investigation)
        return investigation


class NormeCertificationService:
    """ISO certification service"""
    
    @staticmethod
    def creer_certification(
        db: Session,
        numero_certificat: str,
        norme: NormeISO,
        organisme: str,
        date_obtention: date,
        date_expiration: date,
        scope: str
    ) -> NormeCertification:
        """Create ISO certification"""
        certification = NormeCertification(
            numero_certificat=numero_certificat,
            norme=norme,
            organisme=organisme,
            date_obtention=date_obtention,
            date_expiration=date_expiration,
            scope=scope,
            statut="actif"
        )
        db.add(certification)
        db.commit()
        db.refresh(certification)
        return certification


class AuditQualiteService:
    """Quality audit service"""
    
    @staticmethod
    def creer_audit(
        db: Session,
        numero_audit: str,
        certification_id: int,
        type_audit: str,
        date_debut: date,
        date_fin: date,
        auditeur: str
    ) -> AuditQualite:
        """Create quality audit"""
        audit = AuditQualite(
            numero_audit=numero_audit,
            certification_id=certification_id,
            type_audit=type_audit,
            date_debut=date_debut,
            date_fin=date_fin,
            auditeur=auditeur,
            statut="en_cours"
        )
        db.add(audit)
        db.commit()
        db.refresh(audit)
        return audit


class HACCPPlanService:
    """HACCP plan service"""
    
    @staticmethod
    def creer_plan_haccp(
        db: Session,
        numero_plan: str,
        produit: str,
        processus: str,
        responsable: str
    ) -> HACCPPlan:
        """Create HACCP plan"""
        plan = HACCPPlan(
            numero_plan=numero_plan,
            produit=produit,
            processus=processus,
            date_creation=date.today(),
            responsable=responsable,
            statut="actif"
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)
        return plan


class PointCritiqueCCPService:
    """Critical Control Point service"""
    
    @staticmethod
    def ajouter_ccp(
        db: Session,
        haccp_plan_id: int,
        numero_ccp: str,
        etape: str,
        danger: str,
        limites_critiques: str,
        surveillance: str
    ) -> PointCritiqueCCP:
        """Add critical control point"""
        ccp = PointCritiqueCCP(
            haccp_plan_id=haccp_plan_id,
            numero_ccp=numero_ccp,
            etape=etape,
            danger=danger,
            limites_critiques=limites_critiques,
            surveillance=surveillance,
            statut="actif"
        )
        db.add(ccp)
        db.commit()
        db.refresh(ccp)
        return ccp


class EnregistrementHACCPService:
    """HACCP record service"""
    
    @staticmethod
    def enregistrer_controle(
        db: Session,
        point_critique_id: int,
        valeur_mesuree: float,
        unite: str,
        operateur: str
    ) -> EnregistrementHACCP:
        """Record HACCP control"""
        enregistrement = EnregistrementHACCP(
            point_critique_id=point_critique_id,
            date_enregistrement=datetime.utcnow(),
            valeur_mesuree=valeur_mesuree,
            unite=unite,
            conforme=True,
            operateur=operateur
        )
        db.add(enregistrement)
        db.commit()
        db.refresh(enregistrement)
        return enregistrement


class FormationQHSEService:
    """QHSE training service"""
    
    @staticmethod
    def creer_formation(
        db: Session,
        numero_formation: str,
        type_formation: str,
        titre: str,
        formateur: str,
        date_debut: date,
        date_fin: date,
        duree_heures: int
    ) -> FormationQHSE:
        """Create QHSE training"""
        formation = FormationQHSE(
            numero_formation=numero_formation,
            type_formation=type_formation,
            titre=titre,
            formateur=formateur,
            date_debut=date_debut,
            date_fin=date_fin,
            duree_heures=duree_heures,
            statut="planifie"
        )
        db.add(formation)
        db.commit()
        db.refresh(formation)
        return formation


class IndicateurQHSEService:
    """QHSE indicator service"""
    
    @staticmethod
    def creer_indicateur(
        db: Session,
        code: str,
        nom: str,
        type_indicateur: str,
        unite: str,
        objectif: float
    ) -> IndicateurQHSE:
        """Create QHSE indicator"""
        indicateur = IndicateurQHSE(
            code=code,
            nom=nom,
            type_indicateur=type_indicateur,
            unite=unite,
            objectif=objectif,
            statut="actif"
        )
        db.add(indicateur)
        db.commit()
        db.refresh(indicateur)
        return indicateur
    
    @staticmethod
    def mettre_a_jour_valeur(
        db: Session,
        indicateur_id: int,
        valeur_actuelle: float
    ) -> IndicateurQHSE:
        """Update indicator value"""
        indicateur = db.query(IndicateurQHSE).filter(IndicateurQHSE.id == indicateur_id).first()
        if not indicateur:
            raise ValueError("Indicateur non trouvé")
        
        valeur_previous = indicateur.valeur_actuelle or 0
        variation = valeur_actuelle - valeur_previous
        
        if variation > 0:
            tendance = "amelioration"
        elif variation < 0:
            tendance = "degradation"
        else:
            tendance = "stagnation"
        
        indicateur.valeur_actuelle = valeur_actuelle
        indicateur.valeur_previous = valeur_previous
        indicateur.variation = variation
        indicateur.tendance = tendance
        indicateur.date_mesure = date.today()
        
        db.commit()
        db.refresh(indicateur)
        return indicateur


class QHSEReportingService:
    """QHSE reporting service"""
    
    @staticmethod
    def rapport_securite(db: Session, annee: int) -> Dict[str, Any]:
        """Generate safety report"""
        accidents = db.query(AccidentTravail).filter(
            func.extract('year', AccidentTravail.date_accident) == annee
        ).all()
        
        analyses = db.query(AnalyseRisque).filter(
            AnalyseRisque.date_analyse.between(date(annee, 1, 1), date(annee, 12, 31))
        ).all()
        
        return {
            "annee": annee,
            "accidents": {
                "total": len(accidents),
                "graves": sum(1 for a in accidents if a.gravite in ["grave", "mortel"]),
                "arrets_travail": sum(a.arret_travail or 0 for a in accidents)
            },
            "risques": {
                "total": len(analyses),
                "critiques": sum(1 for a in analyses if a.niveau_risque == "critique"),
                "eleves": sum(1 for a in analyses if a.niveau_risque == "eleve")
            }
        }


# Facade service for backward compatibility
class QHSEService:
    """Unified QHSE service facade"""
    risques = AnalyseRisqueService
    prevention = ActionPreventionService
    plans = PlanPreventionService
    epi = EPIRequisService
    accidents = AccidentTravailService
    investigations = InvestigationAccidentService
    normes = NormeCertificationService
    audits = AuditQualiteService
    haccp = HACCPPlanService
    points_critiques = PointCritiqueCCPService
    enregistrements = EnregistrementHACCPService
    formations = FormationQHSEService
    indicateurs = IndicateurQHSEService
    reporting = QHSEReportingService
