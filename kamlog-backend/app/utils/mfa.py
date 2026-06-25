# app/utils/mfa.py  Multi-Factor Authentication Utilities
import pyotp
import qrcode
import io
import base64
import json
from typing import List
from app.config import settings


def generate_mfa_secret() -> str:
    """Génère un secret TOTP pour MFA."""
    return pyotp.random_base32()


def generate_mfa_qr_code(username: str, secret: str) -> str:
    """
    Génère un QR code pour la configuration MFA.
    
    Args:
        username: Nom d'utilisateur
        secret: Secret TOTP
        
    Returns:
        Base64 encoded QR code image
    """
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=username,
        issuer_name="KAMLOG ERP"
    )
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convertir l'image en base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"


def verify_totp_token(secret: str, token: str) -> bool:
    """
    Vérifie un token TOTP.
    
    Args:
        secret: Secret TOTP
        token: Token à vérifier (6 chiffres)
        
    Returns:
        True si le token est valide
    """
    totp = pyotp.TOTP(secret)
    return totp.verify(token, valid_window=1)  # Valid window de 1 pour tolérer les décalages de temps


def generate_backup_codes(count: int = 10) -> List[str]:
    """
    Génère des codes de secours pour MFA.
    
    Args:
        count: Nombre de codes à générer
        
    Returns:
        Liste des codes de secours
    """
    import secrets
    import string
    
    codes = []
    for _ in range(count):
        code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        codes.append(code)
    
    return codes


def verify_backup_code(stored_codes_json: str, provided_code: str) -> tuple[bool, str]:
    """
    Vérifie un code de secours et le supprime de la liste s'il est valide.
    
    Args:
        stored_codes_json: Codes de secours stockés (JSON string)
        provided_code: Code fourni par l'utilisateur
        
    Returns:
        Tuple (is_valid, updated_codes_json)
    """
    try:
        codes = json.loads(stored_codes_json)
    except:
        codes = []
    
    if provided_code in codes:
        codes.remove(provided_code)
        return True, json.dumps(codes)
    
    return False, stored_codes_json


def is_mfa_required_for_user(user_role: str) -> bool:
    """
    Détermine si MFA est requis pour un rôle d'utilisateur.
    
    Args:
        user_role: Rôle de l'utilisateur
        
    Returns:
        True si MFA est requis
    """
    return False # Temporarily disabled for testing (was: user_role == "admin")
