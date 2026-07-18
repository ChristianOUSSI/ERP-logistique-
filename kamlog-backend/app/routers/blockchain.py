# app/routers/blockchain.py - Routes API pour l'intégration blockchain
from app.utils.rbac import require_role
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.models.user import User

from app.services.blockchain_service import blockchain_service, DocumentType

router = APIRouter(prefix="/api/v1/blockchain", tags=["Blockchain"])


@router.post("/documents/hash")
    @require_role(["admin", "manager"])
def hash_document(
    document_content: Any = Body(...),
    document_type: str = Body(...),
    metadata: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcule le hash d'un document pour assurer son intégrité.
    """
    # Vérifier les permissions
    # check_permission("blockchain:document:hash")(current_user)

    try:
        # Parser le type de document
        try:
            doc_type_enum = DocumentType(document_type.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid document type. Supported types: {[dt.value for dt in DocumentType]}"
            )

        document_hash = blockchain_service.hash_document(
            document_content=document_content,
            document_type=doc_type_enum,
            metadata=metadata
        )

        return {
            "document_hash": document_hash,
            "document_type": document_type,
            "message": "Document hashed successfully",
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/documents/verify")
    @require_role(["admin", "manager"])
def verify_document_integrity(
    document_content: Any = Body(...),
    document_hash: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie l'intégrité d'un document en comparant son hash actuel avec celui enregistré.
    """
    # Vérifier les permissions
    # check_permission("blockchain:document:verify")(current_user)

    is_valid = blockchain_service.verify_document_integrity(document_content, document_hash)

    return {
        "document_hash": document_hash,
        "is_valid": is_valid,
        "message": "Document integrity verified" if is_valid else "Document integrity check failed",
        "timestamp": datetime.now().isoformat()
    }


@router.post("/documents/register")
    @require_role(["admin", "manager"])
def register_document_on_blockchain(
    document_content: Any = Body(...),
    document_type: str = Body(...),
    metadata: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enregistre un document sur la blockchain après avoir calculé son hash.
    """
    # Vérifier les permissions
    # check_permission("blockchain:document:register")(current_user)

    try:
        # Parser le type de document
        try:
            doc_type_enum = DocumentType(document_type.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid document type. Supported types: {[dt.value for dt in DocumentType]}"
            )

        result = blockchain_service.add_document_to_blockchain(
            document_content=document_content,
            document_type=doc_type_enum,
            metadata=metadata
        )

        return {
            "document_hash": result["document_hash"],
            "transaction_id": result["transaction_id"],
            "message": result["message"],
            "timestamp": result["timestamp"]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/mine")
    @require_role(["admin", "manager"])
def mine_pending_transactions(
    miner_address: str = Body("network"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mine les transactions en attente et crée un nouveau bloc sur la blockchain.
    """
    # Vérifier les permissions
    # check_permission("blockchain:mine")(current_user)

    result = blockchain_service.mine_pending_transactions(miner_address)

    if result["block_index"] is None:
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.get("/chain")
def get_blockchain(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère la chaîne complète de blocs.
    """
    # Vérifier les permissions
    # check_permission("blockchain:chain:read")(current_user)

    chain = blockchain_service.get_chain()

    return {
        "chain": chain,
        "length": len(chain),
        "timestamp": datetime.now().isoformat()
    }


@router.get("/chain/validate")
def validate_blockchain(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie l'intégrité de la blockchain.
    """
    # Vérifier les permissions
    # check_permission("blockchain:chain:validate")(current_user)

    is_valid = blockchain_service.is_chain_valid()

    return {
        "is_valid": is_valid,
        "message": "Blockchain is valid" if is_valid else "Blockchain is invalid",
        "length": blockchain_service.get_chain_length(),
        "timestamp": datetime.now().isoformat()
    }


@router.get("/documents/{document_hash}/history")
def get_document_history(
    document_hash: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère l'historique d'un document sur la blockchain.
    """
    # Vérifier les permissions
    # check_permission("blockchain:document:history")(current_user)

    history = blockchain_service.get_document_history(document_hash)

    if not history:
        # Vérifier si le document existe au moins dans le registre
        if document_hash not in blockchain_service.document_registry:
            raise HTTPException(status_code=404, detail="Document not found")
        else:
            return {
                "document_hash": document_hash,
                "history": [],
                "message": "Document found in registry but no blockchain transactions found",
                "document_type": blockchain_service.document_registry[document_hash]["document_type"],
                "timestamp": datetime.now().isoformat()
            }

    return {
        "document_hash": document_hash,
        "history": history,
        "count": len(history),
        "timestamp": datetime.now().isoformat()
    }


@router.get("/documents/{document_hash}/verify")
def verify_document_on_blockchain(
    document_hash: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie si un document existe sur la blockchain et retourne ses informations.
    """
    # Vérifier les permissions
    # check_permission("blockchain:document:verify")(current_user)

    result = blockchain_service.verify_document_on_blockchain(document_hash)

    if not result["exists"]:
        raise HTTPException(status_code=404, detail=result.get("message", "Document not found on blockchain"))

    return result


@router.get("/stats")
def get_blockchain_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère des statistiques sur la blockchain et les documents enregistrés.
    """
    # Vérifier les permissions
    # check_permission("blockchain:stats")(current_user)

    chain = blockchain_service.get_chain()
    pending_count = len(blockchain_service.pending_transactions)
    registry_count = len(blockchain_service.document_registry)

    # Compter les types de documents
    doc_type_counts = {}
    for doc_hash, doc_meta in blockchain_service.document_registry.items():
        doc_type = doc_meta["document_type"]
        doc_type_counts[doc_type] = doc_type_counts.get(doc_type, 0) + 1

    return {
        "chain_length": len(chain),
        "pending_transactions": pending_count,
        "registered_documents": registry_count,
        "document_type_distribution": doc_type_counts,
        "is_valid": blockchain_service.is_chain_valid(),
        "timestamp": datetime.now().isoformat()
    }