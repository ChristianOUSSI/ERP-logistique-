# app/services/blockchain_service.py - Service d'intégration blockchain pour la sécurisation des documents
import hashlib
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum

from app.utils.logger import get_logger

logger = get_logger(__name__)


class DocumentType(str, Enum):
    """Types de documents supportés pour la blockchain"""
    BILL_OF_LADING = "bill_of_lading"
    COMMERCIAL_INVOICE = "commercial_invoice"
    PACKING_LIST = "packing_list"
    CERTIFICATE_OF_ORIGIN = "certificate_of_origin"
    INSURANCE_CERTIFICATE = "insurance_certificate"
    CUSTOMS_DECLARATION = "customs_declaration"
    DELIVERY_ORDER = "delivery_order"
    RECEIPT = "receipt"


class BlockchainService:
    """Service pour la gestion de l'intégrité documentaire via hashage et blockchain simulée"""

    def __init__(self):
        # En production, ceci serait connecté à une vraie blockchain (Ethereum, Hyperledger, etc.)
        # Pour cette implémentation, on simule une chaîne de blocs simple
        self.chain: List[Dict] = []  # La blockchain
        self.pending_transactions: List[Dict] = []  # Transactions en attente de validation
        self.document_registry: Dict[str, Dict] = {}  # document_hash -> metadata
        self.difficulty = 2  # Difficulté de preuve de travail (nombre de zéros initiaux)
        self.mining_reward = 1  # Récompense pour le minage (symbolique)

        # Créer le bloc genesis
        self._create_genesis_block()

    def _create_genesis_block(self):
        """Crée le premier bloc de la chaîne"""
        genesis_block = {
            "index": 0,
            "timestamp": datetime.now().isoformat(),
            "transactions": [],
            "proof": 100,  # Preuve arbitraire pour le genesis
            "previous_hash": "0" * 64,  # Hash nul pour le premier bloc
            "hash": self._calculate_hash(0, datetime.now().isoformat(), [], 100, "0" * 64)
        }
        self.chain.append(genesis_block)
        logger.info("Genesis block created for blockchain service")

    def _calculate_hash(self, index: int, timestamp: str, transactions: List[Dict],
                       proof: int, previous_hash: str) -> str:
        """
        Calcule le hash SHA-256 d'un bloc.

        Args:
            index: Index du bloc dans la chaîne
            timestamp: Timestamp du bloc
            transactions: Liste des transactions
            proof: Preuve de travail
            previous_hash: Hash du bloc précédent

        Returns:
            Hash SHA-256 du bloc
        """
        block_string = json.dumps({
            "index": index,
            "timestamp": timestamp,
            "transactions": transactions,
            "proof": proof,
            "previous_hash": previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def _proof_of_work(self, previous_proof: int) -> int:
        """
        Algorithme de preuve de travail simple.
        Trouve un proof tel que hash(previous_proof, proof) commence par un certain nombre de zéros.

        Args:
            previous_proof: Preuve du bloc précédent

        Returns:
 Nouvelle preuve de travail
        """
        new_proof = 1
        check_proof = False

        while not check_proof:
            hash_operation = hashlib.sha256(
                f"{new_proof**2 - previous_proof**2}".encode()
            ).hexdigest()
            if hash_operation[:self.difficulty] == "0" * self.difficulty:
                check_proof = True
            else:
                new_proof += 1

        return new_proof

    def hash_document(self, document_content: Any, document_type: DocumentType,
                     metadata: Dict[str, Any] = None) -> str:
        """
        Calcule le hash d'un document pour assurer son intégrité.

        Args:
            document_content: Contenu du document (peut être string, dict, bytes, etc.)
            document_type: Type de document
            metadata: Métadonnées additionnelles sur le document

        Returns:
            Hash SHA-256 du document
        """
        # Normaliser le contenu en string pour le hashage
        if isinstance(document_content, dict):
            content_string = json.dumps(document_content, sort_keys=True)
        elif isinstance(document_content, bytes):
            content_string = document_content.decode('utf-8')
        else:
            content_string = str(document_content)

        # Créer un objet document complet pour le hashage
        document_object = {
            "document_type": document_type.value,
            "content": content_string,
            "metadata": metadata or {},
            "timestamp": datetime.now().isoformat()
        }

        # Calculer le hash
        document_string = json.dumps(document_object, sort_keys=True)
        document_hash = hashlib.sha256(document_string.encode()).hexdigest()

        # Enregistrer dans le registre des documents
        self.document_registry[document_hash] = {
            "hash": document_hash,
            "document_type": document_type.value,
            "size": len(content_string),
            "registered_at": datetime.now().isoformat(),
            "metadata": metadata or {}
        }

        logger.debug(f"Document hashed: {document_hash[:16]}... for type {document_type.value}")
        return document_hash

    def verify_document_integrity(self, document_content: Any, document_hash: str) -> bool:
        """
        Vérifie l'intégrité d'un document en comparant son hash actuel avec celui enregistré.

        Args:
            document_content: Contenu du document à vérifier
            document_hash: Hash attendu du document

        Returns:
            True si l'intégrité est vérifiée, False sinon
        """
        # Vérifier si le hash existe dans notre registre
        if document_hash not in self.document_registry:
            logger.warning(f"Document hash not found in registry: {document_hash[:16]}...")
            return False

        # Recalculer le hash du contenu fourni
        # On suppose que le type de document est dans les métadonnées du registre
        doc_type = DocumentType(self.document_registry[document_hash]["document_type"])
        metadata = self.document_registry[document_hash].get("metadata", {})

        calculated_hash = self.hash_document(document_content, doc_type, metadata)

        is_valid = calculated_hash == document_hash
        if is_valid:
            logger.info(f"Document integrity verified: {document_hash[:16]}...")
        else:
            logger.warning(f"Document integrity check failed: {document_hash[:16]}...")

        return is_valid

    def add_document_to_blockchain(self, document_content: Any, document_type: DocumentType,
                                 metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ajoute un document à la blockchain après avoir calculé son hash.

        Args:
            document_content: Contenu du document
            document_type: Type de document
            metadata: Métadonnées additionnelles

        Returns:
            Informations sur la transaction ajoutée à la blockchain
        """
        # Calculer le hash du document
        document_hash = self.hash_document(document_content, document_type, metadata)

        # Créer la transaction
        transaction = {
            "document_hash": document_hash,
            "document_type": document_type.value,
            "metadata": metadata or {},
            "timestamp": datetime.now().isoformat(),
            "action": "document_registered"
        }

        # Ajouter à la liste des transactions en attente
        self.pending_transactions.append(transaction)

        logger.info(f"Document added to pending transactions: {document_hash[:16]}...")

        return {
            "document_hash": document_hash,
            "transaction_id": f"tx_{len(self.pending_transactions)}",
            "message": "Document added to pending transactions. Will be included in next block.",
            "timestamp": datetime.now().isoformat()
        }


    def mine_pending_transactions(self, miner_address: str = "network") -> Dict[str, Any]:
        """
        Mine les transactions en attente et crée un nouveau bloc.

        Args:
            miner_address: Adresse du mineur (symbolique)

        Returns:
            Informations sur le bloc miné
        """
        if not self.pending_transactions:
            return {
                "message": "No pending transactions to mine",
                "block_index": None
            }

        # Récupérer le preuve du bloc précédent
        last_block = self.chain[-1]
        last_proof = last_block["proof"]

        # Trouver la preuve de travail
        proof = self._proof_of_work(last_proof)

        # Créer le nouveau bloc
        previous_hash = self.hash_chain(last_block)
        block = {
            "index": len(self.chain),
            "timestamp": datetime.now().isoformat(),
            "transactions": self.pending_transactions.copy(),
            "proof": proof,
            "previous_hash": previous_hash,
            "hash": self._calculate_hash(
                len(self.chain),
                datetime.now().isoformat(),
                self.pending_transactions.copy(),
                proof,
                previous_hash
            )
        }

        # Ajouter le bloc à la chaîne
        self.chain.append(block)

        # Réinitialiser les transactions en attente
        self.pending_transactions = []

        logger.info(f"Block mined: {block['index']} with {len(block['transactions'])} transactions")

        # Ajouter la récompense de minage (symbolique)
        reward_transaction = {
            "type": "mining_reward",
            "recipient": miner_address,
            "amount": self.mining_reward,
            "timestamp": datetime.now().isoformat()
        }

        return {
            "block_index": block["index"],
            "block_hash": block["hash"],
            "transactions_count": len(block["transactions"]),
            "proof": block["proof"],
            "previous_hash": block["previous_hash"],
            "timestamp": block["timestamp"],
            "reward_transaction": reward_transaction,
            "message": f"Block {block['index']} successfully mined"
        }

    def hash_chain(self, block: Dict[str, Any]) -> str:
        """
        Calcule le hash d'un bloc pour créer le lien avec le bloc suivant.

        Args:
            block: Bloc à hasher

        Returns:
            Hash du bloc
        """
        # On exclut le hash du bloc lui-même pour éviter la référence circulaire
        block_copy = block.copy()
        block_copy.pop("hash", None)
        return self._calculate_hash(
            block_copy["index"],
            block_copy["timestamp"],
            block_copy["transactions"],
            block_copy["proof"],
            block_copy["previous_hash"]
        )

    def get_chain(self) -> List[Dict]:
        """
        Récupère la chaîne complète de blocs.

        Returns:
            Liste de tous les blocs dans la chaîne
        """
        return self.chain.copy()

    def get_chain_length(self) -> int:
        """
        Récupère la longueur de la chaîne.

        Returns:
            Nombre de blocs dans la chaîne
        """
        return len(self.chain)

    def is_chain_valid(self) -> bool:
        """
        Vérifie l'intégrité complète de la blockchain.

        Returns:
            True si la chaîne est valide, False sinon
        """
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            # Vérifier que le hash du bloc actuel est correct
            if current_block["hash"] != self._calculate_hash(
                current_block["index"],
                current_block["timestamp"],
                current_block["transactions"],
                current_block["proof"],
                current_block["previous_hash"]
            ):
                logger.error(f"Invalid hash at block {current_block['index']}")
                return False

            # Vérifier que le hash du bloc précédent est référencé correctement
            if current_block["previous_hash"] != self.hash_chain(previous_block):
                logger.error(f"Invalid previous hash reference at block {current_block['index']}")
                return False

        logger.info("Blockchain validation passed")
        return True

    def get_document_history(self, document_hash: str) -> List[Dict]:
        """
        Récupère l'historique d'un document dans la blockchain.

        Args:
            document_hash: Hash du document à tracer

        Returns:
            Liste des blocs contenant ce document
        """
        history = []

        for block in self.chain:
            for transaction in block.get("transactions", []):
                if transaction.get("document_hash") == document_hash:
                    history.append({
                        "block_index": block["index"],
                        "block_hash": block["hash"],
                        "timestamp": block["timestamp"],
                        "transaction": transaction
                    })

        return history

    def verify_document_on_blockchain(self, document_hash: str) -> Dict[str, Any]:
        """
        Vérifie si un document existe sur la blockchain et retourne ses informations.

        Args:
            document_hash: Hash du document à vérifier

        Returns:
            Informations sur la présence du document sur la blockchain
        """
        if document_hash not in self.document_registry:
            return {
                "exists": False,
                "message": "Document not found in registry"
            }

        # Rechercher dans la blockchain
        history = self.get_document_history(document_hash)

        if not history:
            return {
                "exists": False,
                "message": "Document found in registry but not on blockchain",
                "document_type": self.document_registry[document_hash]["document_type"]
            }

        # Retourner la première occurrence (la plus ancienne)
        first_occurrence = history[0]

        return {
            "exists": True,
            "document_type": self.document_registry[document_hash]["document_type"],
            "first_seen_block": first_occurrence["block_index"],
            "first_seen_timestamp": first_occurrence["timestamp"],
            "total_appearances": len(history),
            "history": history,
            "message": "Document found on blockchain"
        }


# Instance globale du service blockchain
blockchain_service = BlockchainService()