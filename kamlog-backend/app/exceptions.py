# app/exceptions.py - Exceptions métier spécifiques KAMLOG EM-ERP


class KamlogException(Exception):
    """Exception de base pour toutes les exceptions KAMLOG."""
    pass


class InsufficientStockError(KamlogException):
    """Levée lorsque le stock est insuffisant pour une opération."""
    pass


class InvalidConversionError(KamlogException):
    """Levée lorsqu'une conversion d'unité échoue."""
    pass


class DuplicateResourceError(KamlogException):
    """Levée lorsqu'une ressource existe déjà."""
    pass


class ResourceNotFoundError(KamlogException):
    """Levée lorsqu'une ressource n'est pas trouvée."""
    pass


class InvalidStatusTransitionError(KamlogException):
    """Levée lorsqu'une transition de statut n'est pas valide."""
    pass


class PaymentValidationError(KamlogException):
    """Levée lorsqu'une validation de paiement échoue."""
    pass


class BusinessRuleViolationError(KamlogException):
    """Levée lorsqu'une règle métier est violée."""
    pass


class ConfigurationError(KamlogException):
    """Levée lorsqu'il y a une erreur de configuration."""
    pass
