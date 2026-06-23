#!/usr/bin/env python3
"""
Générateur de secrets sécurisés pour Railway
Exécutez ce script pour générer des valeurs sécurisées à utiliser dans les variables d'environnement Railway
"""
import secrets
import string

def generate_secret(length=32):
    """Génère une chaîne sécurisée aléatoire."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_jwt_secret():
    """Génère un secret JWT sécurisé (min 32 caractères)."""
    return generate_secret(64)

def generate_db_password():
    """Génère un mot de passe base de données sécurisé."""
    return generate_secret(32)

def generate_redis_password():
    """Génère un mot de passe Redis sécurisé."""
    return generate_secret(32)

def generate_minio_secret():
    """Génère un secret MinIO sécurisé."""
    return generate_secret(32)

if __name__ == "__main__":
    print("=" * 70)
    print("SECRETS RAILWAY - KAMLOG EM-ERP")
    print("=" * 70)
    print()
    print("Copiez ces valeurs dans les variables d'environnement Railway:")
    print()
    
    print(f"JWT_SECRET_KEY={generate_jwt_secret()}")
    print()
    print(f"DB_PASSWORD={generate_db_password()}")
    print()
    print(f"REDIS_PASSWORD={generate_redis_password()}")
    print()
    print(f"MINIO_SECRET_KEY={generate_minio_secret()}")
    print()
    print("=" * 70)
    print("IMPORTANT: Conservez ces valeurs en sécurité!")
    print("=" * 70)
