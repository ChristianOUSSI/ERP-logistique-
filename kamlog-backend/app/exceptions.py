# app/exceptions.py - Exceptions métier KAMLOG EM-ERP
from fastapi import HTTPException, status


class AppException(Exception):
    """Exception de base pour l'application."""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """Exception levée quand une ressource n'est pas trouvée."""
    def __init__(self, message: str = "Ressource non trouvée"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class BadRequestException(AppException):
    """Exception levée pour une requête invalide."""
    def __init__(self, message: str = "Requête invalide"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)


class UnauthorizedException(AppException):
    """Exception levée pour un accès non autorisé."""
    def __init__(self, message: str = "Accès non autorisé"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)


class ForbiddenException(AppException):
    """Exception levée pour un accès interdit."""
    def __init__(self, message: str = "Accès interdit"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)


class ConflictException(AppException):
    """Exception levée pour un conflit de données."""
    def __init__(self, message: str = "Conflit de données"):
        super().__init__(message, status.HTTP_409_CONFLICT)


class ValidationException(AppException):
    """Exception levée pour une erreur de validation."""
    def __init__(self, message: str = "Erreur de validation"):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)


class BusinessLogicException(AppException):
    """Exception levée pour une erreur de logique métier."""
    def __init__(self, message: str = "Erreur de logique métier"):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)


# Exceptions spécifiques au métier logistique

class InsufficientStockError(BusinessLogicException):
    """Exception levée quand il n'y a pas assez de stock."""
    def __init__(self, message: str = "Stock insuffisant"):
        super().__init__(message)


class InvalidConversionError(BusinessLogicException):
    """Exception levée pour une conversion d'unité invalide."""
    def __init__(self, message: str = "Conversion d'unité invalide"):
        super().__init__(message)


class BusinessRuleViolationError(BusinessLogicException):
    """Exception levée quand une règle métier est violée."""
    def __init__(self, message: str = "Violation de règle métier"):
        super().__init__(message)


class WorkflowStateError(BusinessLogicException):
    """Exception levée pour un état de workflow invalide."""
    def __init__(self, message: str = "État de workflow invalide"):
        super().__init__(message)


class CreditLimitExceededError(BusinessLogicException):
    """Exception levée quand la limite de crédit est dépassée."""
    def __init__(self, message: str = "Limite de crédit dépassée"):
        super().__init__(message)


class DuplicateOperationError(ConflictException):
    """Exception levée pour une opération en doublon."""
    def __init__(self, message: str = "Opération en doublon détectée"):
        super().__init__(message)