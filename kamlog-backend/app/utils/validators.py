# app/utils/validators.py - Utilitaires de validation des données
from typing import Optional, List
from datetime import datetime
import re
from decimal import Decimal


class ValidationError(Exception):
    """Exception de validation"""
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(self.message)


class Validator:
    """Classe de validation des données"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Valide un email"""
        if not email:
            return False
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Valide un numéro de téléphone"""
        if not phone:
            return False
        pattern = r'^\+?[0-9]{10,15}$'
        return re.match(pattern, phone.replace(" ", "").replace("-", "")) is not None
    
    @staticmethod
    def validate_niu(niu: str) -> bool:
        """Valide un NIU (Numéro d'Identification Unique)"""
        if not niu:
            return False
        pattern = r'^[A-Z0-9]{10,20}$'
        return re.match(pattern, niu.upper()) is not None
    
    @staticmethod
    def validate_code(code: str, min_length: int = 3, max_length: int = 20) -> bool:
        """Valide un code"""
        if not code:
            return False
        pattern = r'^[A-Z0-9_-]+$'
        return (
            re.match(pattern, code.upper()) is not None and
            min_length <= len(code) <= max_length
        )
    
    @staticmethod
    def validate_positive_number(value: Union[int, float, Decimal]) -> bool:
        """Valide qu'un nombre est positif"""
        try:
            return Decimal(str(value)) > 0
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_non_negative_number(value: Union[int, float, Decimal]) -> bool:
        """Valide qu'un nombre est non négatif"""
        try:
            return Decimal(str(value)) >= 0
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_percentage(value: Union[int, float, Decimal]) -> bool:
        """Valide qu'un nombre est un pourcentage (0-100)"""
        try:
            decimal_value = Decimal(str(value))
            return Decimal('0') <= decimal_value <= Decimal('100')
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_date_range(date_debut: datetime, date_fin: datetime) -> bool:
        """Valide qu'une plage de dates est valide"""
        if not date_debut or not date_fin:
            return False
        return date_debut <= date_fin
    
    @staticmethod
    def validate_future_date(date: datetime) -> bool:
        """Valide qu'une date est dans le futur"""
        if not date:
            return False
        return date > datetime.now()
    
    @staticmethod
    def validate_past_date(date: datetime) -> bool:
        """Valide qu'une date est dans le passé"""
        if not date:
            return False
        return date < datetime.now()
    
    @staticmethod
    def validate_string_length(value: str, min_length: int = 1, max_length: int = 255) -> bool:
        """Valide la longueur d'une chaîne"""
        if not value:
            return min_length == 0
        return min_length <= len(value) <= max_length
    
    @staticmethod
    def validate_required_fields(data: dict, required_fields: List[str]) -> List[str]:
        """Valide que les champs requis sont présents"""
        missing_fields = []
        for field in required_fields:
            if field not in data or data[field] is None or data[field] == "":
                missing_fields.append(field)
        return missing_fields
    
    @staticmethod
    def validate_enum(value: str, allowed_values: List[str]) -> bool:
        """Valide qu'une valeur est dans une liste autorisée"""
        return value in allowed_values
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Valide une URL"""
        if not url:
            return False
        pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        return re.match(pattern, url) is not None


class BusinessValidator:
    """Validateur des règles métier"""
    
    @staticmethod
    def validate_stock_quantity(quantity: Union[int, float, Decimal], available_quantity: Union[int, float, Decimal]) -> bool:
        """Valide qu'une quantité de stock est disponible"""
        try:
            qty = Decimal(str(quantity))
            available = Decimal(str(available_quantity))
            return qty <= available
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_payment_amount(amount: Union[int, float, Decimal], total_due: Union[int, float, Decimal]) -> bool:
        """Valide qu'un montant de paiement est valide"""
        try:
            payment = Decimal(str(amount))
            due = Decimal(str(total_due))
            return payment > 0 and payment <= due
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_credit_limit(amount: Union[int, float, Decimal], current_balance: Union[int, float, Decimal], credit_limit: Union[int, float, Decimal]) -> bool:
        """Valide qu'une opération respecte la limite de crédit"""
        try:
            operation = Decimal(str(amount))
            balance = Decimal(str(current_balance))
            limit = Decimal(str(credit_limit))
            return (balance + operation) <= limit
        except (ValueError, TypeError):
            return False
    
    @staticmethod
    def validate_business_hours(date: datetime) -> bool:
        """Valide qu'une date est pendant les heures ouvrées (8h-18h)"""
        if not date:
            return False
        return 8 <= date.hour < 18
    
    @staticmethod
    def validate_working_day(date: datetime) -> bool:
        """Valide qu'une date est un jour ouvré (Lun-Ven)"""
        if not date:
            return False
        return date.weekday() < 5  # 0-4 = Lun-Ven


def validate_supplier_data(data: dict) -> List[str]:
    """Valide les données fournisseur"""
    errors = []
    
    # Champs requis
    required_fields = ["raison_sociale", "niu", "email"]
    missing = Validator.validate_required_fields(data, required_fields)
    errors.extend([f"Champ requis manquant: {field}" for field in missing])
    
    # Validation email
    if "email" in data and data["email"]:
        if not Validator.validate_email(data["email"]):
            errors.append("Email invalide")
    
    # Validation NIU
    if "niu" in data and data["niu"]:
        if not Validator.validate_niu(data["niu"]):
            errors.append("NIU invalide")
    
    # Validation téléphone
    if "telephone" in data and data["telephone"]:
        if not Validator.validate_phone(data["telephone"]):
            errors.append("Téléphone invalide")
    
    # Validation limite de crédit
    if "limite_credit_xaf" in data and data["limite_credit_xaf"]:
        if not Validator.validate_non_negative_number(data["limite_credit_xaf"]):
            errors.append("Limite de crédit doit être non négative")
    
    return errors


def validate_goods_declaration_data(data: dict) -> List[str]:
    """Valide les données de déclaration de marchandises"""
    errors = []
    
    # Champs requis
    required_fields = ["article_id", "quantite", "unite"]
    missing = Validator.validate_required_fields(data, required_fields)
    errors.extend([f"Champ requis manquant: {field}" for field in missing])
    
    # Validation quantité
    if "quantite" in data and data["quantite"]:
        if not Validator.validate_positive_number(data["quantite"]):
            errors.append("Quantité doit être positive")
    
    # Validation poids
    if "poids" in data and data["poids"]:
        if not Validator.validate_non_negative_number(data["poids"]):
            errors.append("Poids doit être non négatif")
    
    # Validation valeur
    if "valeur" in data and data["valeur"]:
        if not Validator.validate_non_negative_number(data["valeur"]):
            errors.append("Valeur doit être non négative")
    
    return errors


def validate_removal_slip_data(data: dict) -> List[str]:
    """Valide les données de bon d'enlèvement"""
    errors = []
    
    # Champs requis
    required_fields = ["article_id", "quantite", "unite", "magasin_destination", "date_bon"]
    missing = Validator.validate_required_fields(data, required_fields)
    errors.extend([f"Champ requis manquant: {field}" for field in missing])
    
    # Validation quantité
    if "quantite" in data and data["quantite"]:
        if not Validator.validate_positive_number(data["quantite"]):
            errors.append("Quantité doit être positive")
    
    # Validation date
    if "date_bon" in data and data["date_bon"]:
        if not Validator.validate_past_date(data["date_bon"]):
            errors.append("Date du bon doit être dans le passé ou aujourd'hui")
    
    return errors


def validate_reception_mag3_data(data: dict) -> List[str]:
    """Valide les données de réception Mag3"""
    errors = []
    
    # Champs requis
    required_fields = ["removal_slip_id", "article_id", "quantite_attendue", "quantite_recue", "unite", "date_reception"]
    missing = Validator.validate_required_fields(data, required_fields)
    errors.extend([f"Champ requis manquant: {field}" for field in missing])
    
    # Validation quantités
    if "quantite_attendue" in data and data["quantite_attendue"]:
        if not Validator.validate_positive_number(data["quantite_attendue"]):
            errors.append("Quantité attendue doit être positive")
    
    if "quantite_recue" in data and data["quantite_recue"]:
        if not Validator.validate_positive_number(data["quantite_recue"]):
            errors.append("Quantité reçue doit être positive")
    
    # Validation cohérence quantités
    if "quantite_attendue" in data and "quantite_recue" in data:
        if Decimal(str(data["quantite_recue"])) > Decimal(str(data["quantite_attendue"])):
            errors.append("Quantité reçue ne peut pas être supérieure à la quantité attendue")
    
    # Validation date
    if "date_reception" in data and data["date_reception"]:
        if not Validator.validate_past_date(data["date_reception"]):
            errors.append("Date de réception doit être dans le passé ou aujourd'hui")
    
    return errors
