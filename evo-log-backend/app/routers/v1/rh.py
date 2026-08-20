"""RH router - Complete HR management endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.rh import (
    CongeCreate, CongeUpdate, CongeResponse, SoldeCongeResponse,
    AbsenceCreate, AbsenceUpdate, AbsenceResponse,
    TempsTravailCreate, TempsTravailUpdate, TempsTravailResponse, HeuresMensuellesResponse,
    FormationCreate, FormationUpdate, FormationResponse,
    ParticipationFormationCreate, ParticipationFormationUpdate, ParticipationFormationResponse,
    EvaluationPerformanceCreate, EvaluationPerformanceUpdate, EvaluationPerformanceResponse,
    ContratTravailCreate, ContratTravailUpdate, ContratTravailResponse,
    SalaireCreate, SalaireResponse,
    PrimeCreate, PrimeResponse,
    DocumentEmployeCreate, DocumentEmployeUpdate, DocumentEmployeResponse,
    OrganigrammeCreate, OrganigrammeUpdate, OrganigrammeResponse,
    CompetenceCreate, CompetenceUpdate, CompetenceResponse,
    CompetenceEmployeCreate, CompetenceEmployeUpdate, CompetenceEmployeResponse,
    BulletinPaieResponse
)
from app.services.rh_service import (
    CongeService, AbsenceService, TempsTravailService, FormationService,
    PerformanceService, ContratService, PaieService, DocumentEmployeService,
    OrganigrammeService, CompetenceService
)

router = APIRouter(prefix="/rh", tags=["RH"])


# ============ CONGÉS ============
@router.post("/conges", response_model=CongeResponse, status_code=status.HTTP_201_CREATED)
def demander_conge(
    conge: CongeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit leave request"""
    return CongeService.demander_conge(
        db, current_user.id, conge.type_conge, conge.date_debut,
        conge.date_fin, conge.motif
    )


@router.get("/conges/solde/{employe_id}/{annee}", response_model=SoldeCongeResponse)
def obtenir_solde_conge(
    employe_id: int,
    annee: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get leave balance for employee and year"""
    return CongeService.calculer_solde_conge(db, employe_id, annee)


@router.put("/conges/{conge_id}/approuver", response_model=CongeResponse)
def approuver_conge(
    conge_id: int,
    commentaire: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Approve leave request"""
    return CongeService.approuver_conge(db, conge_id, current_user.id, commentaire)


@router.put("/conges/{conge_id}/rejeter", response_model=CongeResponse)
def rejeter_conge(
    conge_id: int,
    motif_refus: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reject leave request"""
    return CongeService.rejeter_conge(db, conge_id, current_user.id, motif_refus)


# ============ ABSENCES ============
@router.post("/absences", response_model=AbsenceResponse, status_code=status.HTTP_201_CREATED)
def enregistrer_absence(
    absence: AbsenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Record absence"""
    return AbsenceService.enregistrer_absence(
        db, current_user.id, absence.type_absence, absence.date_debut,
        absence.date_fin, absence.motif, absence.justifie
    )


@router.get("/absences/taux/{employe_id}/{mois}/{annee}")
def obtenir_taux_absenteisme(
    employe_id: int,
    mois: int,
    annee: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate absenteeism rate"""
    taux = AbsenceService.calculer_taux_absenteisme(db, employe_id, mois, annee)
    return {"employe_id": employe_id, "mois": mois, "annee": annee, "taux_absenteisme": taux}


# ============ TEMPS DE TRAVAIL ============
@router.post("/pointage/arrivee", response_model=TempsTravailResponse, status_code=status.HTTP_201_CREATED)
def pointer_arrivee(
    date_pointage: date,
    heure_arrivee: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clock in"""
    return TempsTravailService.pointer_arrivee(db, current_user.id, date_pointage, heure_arrivee)


@router.post("/pointage/depart", response_model=TempsTravailResponse)
def pointer_depart(
    date_pointage: date,
    heure_depart: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clock out"""
    return TempsTravailService.pointer_depart(db, current_user.id, date_pointage, heure_depart)


@router.get("/heures/{employe_id}/{mois}/{annee}", response_model=HeuresMensuellesResponse)
def calculer_heures_mois(
    employe_id: int,
    mois: int,
    annee: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate monthly hours worked"""
    return TempsTravailService.calculer_heures_mois(db, employe_id, mois, annee)


# ============ FORMATIONS ============
@router.post("/formations", response_model=FormationResponse, status_code=status.HTTP_201_CREATED)
def creer_formation(
    formation: FormationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create training session"""
    return FormationService.creer_formation(
        db, formation.titre, formation.description, formation.date_debut,
        formation.date_fin, formation.duree_heures, formation.cout,
        formation.formateur, formation.lieu, formation.agency_id
    )


@router.post("/formations/{formation_id}/inscrire/{employe_id}", response_model=ParticipationFormationResponse, status_code=status.HTTP_201_CREATED)
def inscrire_formation(
    formation_id: int,
    employe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enroll employee in training"""
    return FormationService.inscrire_employe(db, formation_id, employe_id)


@router.put("/formations/participations/{participation_id}")
def valider_participation(
    participation_id: int,
    present: bool,
    certificat_obtenu: bool = False,
    commentaire: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Validate training participation"""
    return FormationService.valider_participation(
        db, participation_id, present, certificat_obtenu, commentaire
    )


@router.get("/formations/expirantes")
def obtenir_formations_expirantes(
    jours_avance: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get trainings with expiring certifications"""
    return FormationService.obtenir_formations_expirantes(db, jours_avance)


# ============ PERFORMANCE ============
@router.post("/evaluations", response_model=EvaluationPerformanceResponse, status_code=status.HTTP_201_CREATED)
def creer_evaluation(
    evaluation: EvaluationPerformanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create performance evaluation"""
    return PerformanceService.creer_evaluation(
        db, evaluation.employe_id, evaluation.evaluateur_id,
        evaluation.periode_debut, evaluation.periode_fin,
        evaluation.note_globale, evaluation.commentaires,
        evaluation.objectifs_atteints, evaluation.objectifs_total
    )


@router.get("/evaluations/{employe_id}")
def obtenir_historique_evaluation(
    employe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get employee evaluation history"""
    return PerformanceService.obtenir_historique_evaluation(db, employe_id)


# ============ CONTRATS ============
@router.post("/contrats", response_model=ContratTravailResponse, status_code=status.HTTP_201_CREATED)
def creer_contrat(
    contrat: ContratTravailCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create employment contract"""
    return ContratService.creer_contrat(
        db, contrat.employe_id, contrat.type_contrat, contrat.date_debut,
        contrat.date_fin, contrat.poste, contrat.salaire_base,
        contrat.coefficient, contrat.classification, contrat.periode_essai_jours
    )


@router.get("/contrats/expirants")
def obtenir_contrats_expirants(
    jours_avance: int = 60,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get contracts expiring soon"""
    return ContratService.obtenir_contrats_expirants(db, jours_avance)


@router.put("/contrats/{contrat_id}/renouveler", response_model=ContratTravailResponse)
def renouveler_contrat(
    contrat_id: int,
    nouvelle_date_fin: date,
    nouveau_salaire: float = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Renew employment contract"""
    return ContratService.renouveler_contrat(db, contrat_id, nouvelle_date_fin, nouveau_salaire)


# ============ PAIE ============
@router.post("/paie/bulletin", response_model=BulletinPaieResponse)
def preparer_bulletin(
    employe_id: int,
    mois: int,
    annee: int,
    salaire_base: float,
    heures_sup: float = 0,
    primes: List[dict] = [],
    deductions: List[dict] = [],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Prepare payroll bulletin - Configuration-driven for Cameroon"""
    return PaieService.preparer_bulletin(
        db, employe_id, mois, annee, salaire_base, heures_sup, primes, deductions
    )


# ============ DOCUMENTS EMPLOYÉ ============
@router.post("/documents", response_model=DocumentEmployeResponse, status_code=status.HTTP_201_CREATED)
def ajouter_document(
    document: DocumentEmployeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add employee document"""
    return DocumentEmployeService.ajouter_document(
        db, document.employe_id, document.type_document,
        document.chemin_fichier, document.date_emission, document.date_expiration
    )


@router.get("/documents/expirants")
def obtenir_documents_expirants(
    jours_avance: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get documents expiring soon"""
    return DocumentEmployeService.obtenir_documents_expirants(db, jours_avance)


# ============ ORGANIGRAMME ============
@router.post("/organigramme", response_model=OrganigrammeResponse, status_code=status.HTTP_201_CREATED)
def definir_hierarchie(
    org: OrganigrammeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Define employee hierarchy"""
    return OrganigrammeService.definir_hierarchie(
        db, org.employe_id, org.manager_id, org.departement, org.poste
    )


@router.get("/organigramme/subordonnes/{manager_id}")
def obtenir_subordonnes(
    manager_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all direct reports of a manager"""
    return OrganigrammeService.obtenir_subordonnes(db, manager_id)


# ============ COMPÉTENCES ============
@router.post("/competences", response_model=CompetenceResponse, status_code=status.HTTP_201_CREATED)
def creer_competence(
    competence: CompetenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create skill/competency definition"""
    return CompetenceService.creer_competence(
        db, competence.nom, competence.categorie,
        competence.description, competence.niveau_requis
    )


@router.post("/competences/attribuer", response_model=CompetenceEmployeResponse, status_code=status.HTTP_201_CREATED)
def attribuer_competence(
    competence: CompetenceEmployeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign skill to employee"""
    return CompetenceService.attribuer_competence(
        db, competence.employe_id, competence.competence_id,
        competence.niveau, competence.date_evaluation
    )


@router.get("/competences/{employe_id}")
def obtenir_competences_employe(
    employe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all employee skills"""
    return CompetenceService.obtenir_competences_employe(db, employe_id)
