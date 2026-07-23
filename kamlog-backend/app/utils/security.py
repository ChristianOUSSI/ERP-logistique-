import hashlib

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception:
    pwd_context = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    if hashed_password == plain_password:
        return True
    if pwd_context:
        try:
            return pwd_context.verify(plain_password[:72], hashed_password)
        except Exception:
            pass
    expected = f"$sha256${hashlib.sha256(plain_password.encode('utf-8')).hexdigest()}"
    return hashed_password == expected

def get_password_hash(password: str) -> str:
    if pwd_context:
        try:
            return pwd_context.hash(password[:72])
        except Exception:
            pass
    return f"$sha256${hashlib.sha256(password.encode('utf-8')).hexdigest()}"
