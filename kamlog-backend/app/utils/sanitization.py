# app/utils/sanitization.py - Utilitaires de sanitization des entrées utilisateur
import re
from typing import Optional
from html import escape
from email_validator import validate_email, EmailNotValidError


class Sanitizer:
    """Classe utilitaire pour la sanitization des entrées utilisateur."""
    
    @staticmethod
    def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
        """
        Nettoie une chaîne de caractères.
        
        Args:
            value: Chaîne à nettoyer
            max_length: Longueur maximale autorisée
            
        Returns:
            Chaîne nettoyée
        """
        if not value:
            return ""
        
        # Échapper les caractères HTML
        sanitized = escape(value)
        
        # Supprimer les caractères de contrôle sauf \n et \t
        sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', sanitized)
        
        # Tronquer si nécessaire
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized.strip()
    
    @staticmethod
    def sanitize_email(email: str) -> str:
        """
        Valide et nettoie une adresse email.
        
        Args:
            email: Adresse email à valider
            
        Returns:
            Email en minuscules et validé
            
        Raises:
            ValueError: Si l'email est invalide
        """
        if not email:
            raise ValueError("Email requis")
        
        try:
            validated = validate_email(email)
            return validated.email.lower()
        except EmailNotValidError as e:
            raise ValueError(f"Email invalide: {str(e)}")
    
    @staticmethod
    def sanitize_phone(phone: str) -> str:
        """
        Nettoie un numéro de téléphone.
        
        Args:
            phone: Numéro de téléphone
            
        Returns:
            Numéro nettoyé (chiffres uniquement)
        """
        if not phone:
            return ""
        
        # Garder uniquement les chiffres et le +
        sanitized = re.sub(r'[^\d+]', '', phone)
        
        # Valider le format (doit commencer par + ou avoir au moins 9 chiffres)
        if not (sanitized.startswith('+') or len(sanitized) >= 9):
            raise ValueError("Numéro de téléphone invalide")
        
        return sanitized
    
    @staticmethod
    def sanitize_code(code: str, pattern: str = r'^[A-Z0-9-_]+$') -> str:
        """
        Nettoie et valide un code (ex: code article, BL, etc.).
        
        Args:
            code: Code à valider
            pattern: Regex pattern pour validation
            
        Returns:
            Code validé en majuscules
            
        Raises:
            ValueError: Si le code ne correspond pas au pattern
        """
        if not code:
            raise ValueError("Code requis")
        
        sanitized = code.strip().upper()
        
        if not re.match(pattern, sanitized):
            raise ValueError(f"Code invalide. Format attendu: {pattern}")
        
        return sanitized
    
    @staticmethod
    def sanitize_decimal(value: str, min_value: Optional[float] = None, max_value: Optional[float] = None) -> float:
        """
        Valide et convertit une valeur décimale.
        
        Args:
            value: Valeur à convertir
            min_value: Valeur minimale autorisée
            max_value: Valeur maximale autorisée
            
        Returns:
            Valeur décimale validée
            
        Raises:
            ValueError: Si la valeur est invalide ou hors limites
        """
        try:
            decimal_value = float(value)
        except (ValueError, TypeError):
            raise ValueError(f"Valeur décimale invalide: {value}")
        
        if min_value is not None and decimal_value < min_value:
            raise ValueError(f"Valeur doit être >= {min_value}")
        
        if max_value is not None and decimal_value > max_value:
            raise ValueError(f"Valeur doit être <= {max_value}")
        
        return decimal_value
    
    @staticmethod
    def sanitize_url(url: str) -> str:
        """
        Valide et nettoie une URL.
        
        Args:
            url: URL à valider
            
        Returns:
            URL validée
            
        Raises:
            ValueError: Si l'URL est invalide
        """
        if not url:
            return ""
        
        # Validation basique d'URL
        url_pattern = re.compile(
            r'^https?://'  # http:// ou https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domaine
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # IP
            r'(?::\d+)?'  # port optionnel
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(url):
            raise ValueError(f"URL invalide: {url}")
        
        return url


def sanitize_input(data: dict, rules: dict) -> dict:
    """
    Applique les règles de sanitization à un dictionnaire de données.
    
    Args:
        data: Dictionnaire de données à nettoyer
        rules: Règles de sanitization au format {champ: (type, options)}
        
    Returns:
        Dictionnaire nettoyé
        
    Example:
        rules = {
            'nom': ('string', {'max_length': 100}),
            'email': ('email', {}),
            'telephone': ('phone', {}),
            'code': ('code', {'pattern': r'^[A-Z0-9]+$'}),
            'prix': ('decimal', {'min_value': 0}),
        }
    """
    sanitized = {}
    
    for field, (rule_type, options) in rules.items():
        value = data.get(field)
        
        if value is None:
            continue
        
        try:
            if rule_type == 'string':
                sanitized[field] = Sanitizer.sanitize_string(value, **options)
            elif rule_type == 'email':
                sanitized[field] = Sanitizer.sanitize_email(value)
            elif rule_type == 'phone':
                sanitized[field] = Sanitizer.sanitize_phone(value)
            elif rule_type == 'code':
                sanitized[field] = Sanitizer.sanitize_code(value, **options)
            elif rule_type == 'decimal':
                sanitized[field] = Sanitizer.sanitize_decimal(value, **options)
            elif rule_type == 'url':
                sanitized[field] = Sanitizer.sanitize_url(value)
        except ValueError as e:
            raise ValueError(f"Erreur sur champ '{field}': {str(e)}")
    
    return sanitized
