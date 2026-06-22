# app/utils/code_generator.py - Utilitaires pour la génération de codes automatiques
import random
import string
from typing import Optional
from sqlalchemy.orm import Session
from app.models.magasin import Article, OperationTrace


def generate_article_code(db: Session) -> str:
    """
    Génère un code d'article automatique de 7 chiffres.
    Format: 7 chiffres (ex: 1111110, 1234567)
    
    Returns:
        str: Code d'article unique de 7 chiffres
    """
    max_attempts = 100
    for _ in range(max_attempts):
        code = ''.join(random.choices(string.digits, k=7))
        
        # Vérifier si le code existe déjà
        existing = db.query(Article).filter(Article.code_article == code).first()
        if not existing:
            return code
    
    raise ValueError("Impossible de générer un code d'article unique après 100 tentatives")


def generate_ot_number(db: Session) -> str:
    """
    Génère un numéro d'OT (Opération Trace) unique de 9 chiffres.
    Format: 9 chiffres (ex: 780494878)
    
    Returns:
        str: Numéro d'OT unique de 9 chiffres
    """
    max_attempts = 100
    for _ in range(max_attempts):
        # Générer un numéro de 9 chiffres commençant par un chiffre non nul
        first_digit = random.choice('123456789')
        other_digits = ''.join(random.choices(string.digits, k=8))
        ot_number = first_digit + other_digits
        
        # Vérifier si le numéro existe déjà
        existing = db.query(OperationTrace).filter(OperationTrace.numero_ot == ot_number).first()
        if not existing:
            return ot_number
    
    raise ValueError("Impossible de générer un numéro d'OT unique après 100 tentatives")


def create_operation_trace(
    db: Session,
    type_operation: str,
    table_cible: str,
    enregistrement_id: int,
    utilisateur_id: Optional[int] = None,
    donnees_operation: Optional[str] = None
) -> str:
    """
    Crée une trace d'opération avec un numéro d'OT généré automatiquement.
    
    Args:
        db: Session de base de données
        type_operation: Type de l'opération (ex: "CREATION_ARTICLE", "RECEPTION")
        table_cible: Nom de la table concernée
        enregistrement_id: ID de l'enregistrement
        utilisateur_id: ID de l'utilisateur (optionnel)
        donnees_operation: JSON des données de l'opération (optionnel)
    
    Returns:
        str: Numéro d'OT généré
    """
    numero_ot = generate_ot_number(db)
    
    operation_trace = OperationTrace(
        numero_ot=numero_ot,
        type_operation=type_operation,
        table_cible=table_cible,
        enregistrement_id=enregistrement_id,
        utilisateur_id=utilisateur_id,
        donnees_operation=donnees_operation
    )
    
    db.add(operation_trace)
    db.commit()
    
    return numero_ot


def cancel_operation_by_ot(db: Session, numero_ot: str, annule_par: str) -> bool:
    """
    Annule une opération par son numéro d'OT.
    
    Args:
        db: Session de base de données
        numero_ot: Numéro d'OT de l'opération à annuler
        annule_par: Nom de l'utilisateur qui annule
    
    Returns:
        bool: True si l'opération a été annulée, False sinon
    """
    from datetime import datetime
    
    operation = db.query(OperationTrace).filter(
        OperationTrace.numero_ot == numero_ot,
        OperationTrace.est_annule == False
    ).first()
    
    if not operation:
        return False
    
    # Marquer l'opération comme annulée
    operation.est_annule = True
    operation.date_annulation = datetime.utcnow()
    operation.annule_par = annule_par
    
    db.commit()
    
    return True
