"""Tenant router - Multi-tenant SAAS management for Companies, Subscriptions, B2B Portals"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.tenant import (
    CompanyCreate, CompanyUpdate, CompanyResponse,
    SubscriptionPlanCreate, SubscriptionPlanUpdate, SubscriptionPlanResponse,
    SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse,
    DepartmentCreate, DepartmentUpdate, DepartmentResponse,
    B2BPortalCreate, B2BPortalUpdate, B2BPortalResponse,
    RapportCompaniesResponse, RapportRevenusResponse
)
from app.services.tenant_service import (
    CompanyService, SubscriptionPlanService, SubscriptionService,
    DepartmentService, B2BPortalService, TenantReportingService
)
from app.models.tenant import Company, SubscriptionPlan, Subscription, Department, B2BPortal

router = APIRouter(prefix="/tenant", tags=["Tenant Management"])


# ============ COMPANIES ============
@router.post("/companies", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def creer_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new company (Super Admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return CompanyService.creer_company(
        db, company.code, company.nom, company.legal_form, company.tax_id,
        company.email, company.telephone, company.subscription_plan_id, current_user.id
    )


@router.put("/companies/{company_id}/activer", response_model=CompanyResponse)
def activer_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Activate a company"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return CompanyService.activer_company(db, company_id)


@router.put("/companies/{company_id}/suspendre", response_model=CompanyResponse)
def suspendre_company(
    company_id: int,
    raison: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Suspend a company"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return CompanyService.suspendre_company(db, company_id, raison)


@router.put("/companies/{company_id}/quota", response_model=CompanyResponse)
def mettre_a_jour_quota(
    company_id: int,
    max_users: int,
    max_storage_mb: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update company quotas"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return CompanyService.mettre_a_jour_quota(db, company_id, max_users, max_storage_mb)


@router.get("/companies", response_model=List[CompanyResponse])
def lister_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all companies (Super Admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return db.query(Company).all()


# ============ SUBSCRIPTION PLANS ============
@router.post("/plans", response_model=SubscriptionPlanResponse, status_code=status.HTTP_201_CREATED)
def creer_plan(
    plan: SubscriptionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a subscription plan (Super Admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return SubscriptionPlanService.creer_plan(
        db, plan.code, plan.nom, plan.type_plan, plan.prix_mensuel,
        plan.prix_annuel, plan.max_users, plan.max_storage_mb
    )


@router.get("/plans", response_model=List[SubscriptionPlanResponse])
def lister_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all subscription plans"""
    return db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()


# ============ SUBSCRIPTIONS ============
@router.post("/subscriptions", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def creer_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a subscription"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return SubscriptionService.creer_subscription(
        db, subscription.company_id, subscription.plan_id,
        subscription.start_date, subscription.end_date, subscription.amount
    )


@router.put("/subscriptions/{subscription_id}/renouveler", response_model=SubscriptionResponse)
def renouveler_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Renew a subscription"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return SubscriptionService.renouveler_subscription(db, subscription_id)


# ============ DEPARTMENTS ============
@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def creer_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a department (Admin Entreprise)"""
    # Check if user is admin of the company
    if current_user.role_level > 1:
        raise HTTPException(status_code=403, detail="Admin Entreprise required")
    
    return DepartmentService.creer_department(
        db, department.company_id, department.code, department.nom,
        department.description, department.manager_id
    )


@router.get("/companies/{company_id}/departments", response_model=List[DepartmentResponse])
def lister_departments(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List departments for a company"""
    return db.query(Department).filter(Department.company_id == company_id).all()


# ============ B2B PORTALS ============
@router.put("/portals/{portal_id}/personnaliser", response_model=B2BPortalResponse)
def personnaliser_portal(
    portal_id: int,
    primary_color: str,
    secondary_color: str,
    logo_url: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Customize B2B portal"""
    if current_user.role_level > 1:
        raise HTTPException(status_code=403, detail="Admin Entreprise required")
    
    return B2BPortalService.personnaliser_portal(
        db, portal_id, primary_color, secondary_color, logo_url
    )


@router.get("/companies/{company_id}/portal", response_model=B2BPortalResponse)
def get_portal(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get B2B portal for a company"""
    portal = db.query(B2BPortal).filter(B2BPortal.company_id == company_id).first()
    if not portal:
        raise HTTPException(status_code=404, detail="Portal non trouvé")
    return portal


# ============ REPORTING ============
@router.get("/reports/companies", response_model=RapportCompaniesResponse)
def rapport_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate companies report (Super Admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return TenantReportingService.rapport_companies(db)


@router.get("/reports/revenus/{periode}", response_model=RapportRevenusResponse)
def rapport_revenus(
    periode: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate revenue report (Super Admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super Admin required")
    
    return TenantReportingService.rapport_revenus(db, periode)
