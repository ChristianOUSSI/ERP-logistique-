# app/routers/auth.py  Router Authentification
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.utils.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.utils.mfa import generate_mfa_secret, generate_mfa_qr_code, verify_totp_token, generate_backup_codes, verify_backup_code, is_mfa_required_for_user

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
try:
    from scripts.seed_data import seed_agency, seed_users
except ImportError:
    pass

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Récupère l'utilisateur courant depuis le token JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
    return user


@router.post("/force-seed")
async def force_seed():
    """Endpoint manuel pour forcer le seeding en production (Railway)."""
    try:
        from scripts.seed_data import seed_agency, seed_users
        agency_id = await seed_agency()
        await seed_users(agency_id)
        return {"message": "Database seeded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
async def register(
    request: Request,
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Enregistre un nouvel utilisateur."""
    # Vérifier si l'email existe déjà
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Vérifier si le username existe déjà
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Créer l'utilisateur
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role,
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return {
        "id": db_user.id,
        "email": str(db_user.email),
        "username": str(db_user.username),
        "full_name": str(db_user.full_name) if db_user.full_name else None,
        "role": str(db_user.role.value) if hasattr(db_user.role, 'value') else str(db_user.role),
        "is_active": bool(db_user.is_active),
        "created_at": db_user.created_at.isoformat() if db_user.created_at else None,
    }


@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(
    request: Request,
    credentials: UserLogin,
    mfa_token: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import or_
    result = await db.execute(
        select(User).where(
            or_(
                User.username == credentials.username,
                User.email == credentials.username
            )
        )
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Vérifier MFA si activé ou requis
    mfa_required = is_mfa_required_for_user(user.role) or user.mfa_enabled
    
    if mfa_required:
        if user.mfa_enabled:
            # MFA est activé, vérifier le token
            if not mfa_token:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="MFA token required",
                    headers={"X-MFA-Required": "true"}
                )
            
            if not verify_totp_token(user.mfa_secret, mfa_token):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid MFA token"
                )
        else:
            # MFA est requis mais pas encore activé
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="MFA setup required for this role",
                headers={"X-MFA-Setup-Required": "true"}
            )
    
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 30 * 60  # 30 minutes en secondes
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    """Rafraîchit le access token avec le refresh token."""
    payload = decode_token(refresh_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    username: str = payload.get("sub")
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    access_token = create_access_token(data={"sub": user.username})
    new_refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": 30 * 60
    }


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Retourne les informations de l'utilisateur courant."""
    return {
        "id": current_user.id,
        "email": str(current_user.email),
        "username": str(current_user.username),
        "full_name": str(current_user.full_name) if current_user.full_name else None,
        "role": str(current_user.role.value) if hasattr(current_user.role, 'value') else str(current_user.role),
        "is_active": bool(current_user.is_active),
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }


# MFA Schemas
class MFASetupRequest(BaseModel):
    """Request pour la configuration MFA."""
    password: str


class MFAVerifyRequest(BaseModel):
    """Request pour la vérification MFA."""
    token: str


class MFASetupResponse(BaseModel):
    """Response pour la configuration MFA."""
    qr_code: str
    backup_codes: list[str]


@router.post("/mfa/setup", response_model=MFASetupResponse)
@limiter.limit("3/hour")
async def setup_mfa(
    request: Request,
    mfa_data: MFASetupRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Configure MFA pour l'utilisateur courant.
    Génère un secret TOTP et des codes de secours.
    """
    # Vérifier le mot de passe
    if not verify_password(mfa_data.password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    # Vérifier si MFA est déjà activé
    if current_user.mfa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA is already enabled"
        )
    
    # Générer le secret MFA
    secret = generate_mfa_secret()
    
    # Générer le QR code
    qr_code = generate_mfa_qr_code(current_user.username, secret)
    
    # Générer les codes de secours
    backup_codes = generate_backup_codes()
    
    # Stocker temporairement (ne pas activer encore)
    current_user.mfa_secret = secret
    current_user.mfa_backup_codes = backup_codes
    await db.commit()
    
    return {
        "qr_code": qr_code,
        "backup_codes": backup_codes
    }


@router.post("/mfa/enable")
@limiter.limit("5/hour")
async def enable_mfa(
    request: Request,
    mfa_data: MFAVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Active MFA après vérification du token TOTP.
    """
    # Vérifier que le secret existe
    if not current_user.mfa_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA setup not initiated. Call /mfa/setup first."
        )
    
    # Vérifier le token TOTP
    if not verify_totp_token(current_user.mfa_secret, mfa_data.token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid TOTP token"
        )
    
    # Activer MFA
    current_user.mfa_enabled = True
    await db.commit()
    
    return {"message": "MFA enabled successfully"}


@router.post("/mfa/disable")
@limiter.limit("5/hour")
async def disable_mfa(
    request: Request,
    password: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Désactive MFA pour l'utilisateur courant.
    """
    # Vérifier le mot de passe
    if not verify_password(password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    # Vérifier si MFA est activé
    if not current_user.mfa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA is not enabled"
        )
    
    # Désactiver MFA
    current_user.mfa_enabled = False
    current_user.mfa_secret = None
    current_user.mfa_backup_codes = None
    await db.commit()
    
    return {"message": "MFA disabled successfully"}


@router.post("/mfa/verify-backup")
@limiter.limit("10/hour")
async def verify_backup_code(
    request: Request,
    code: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Vérifie un code de secours MFA.
    """
    if not current_user.mfa_enabled or not current_user.mfa_backup_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA not enabled or no backup codes available"
        )
    
    is_valid, updated_codes = verify_backup_code(current_user.mfa_backup_codes, code)
    
    if is_valid:
        current_user.mfa_backup_codes = updated_codes
        await db.commit()
        return {"message": "Backup code verified successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid backup code"
        )


@router.get("/mfa/status")
async def get_mfa_status(current_user: User = Depends(get_current_user)):
    """Retourne le statut MFA de l'utilisateur courant."""
    return {
        "mfa_enabled": current_user.mfa_enabled,
        "mfa_required": is_mfa_required_for_user(current_user.role)
    }
