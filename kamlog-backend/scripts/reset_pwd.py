import os
from app.database import SessionLocal
from app.models.user import User
from app.utils.security import get_password_hash
from sqlalchemy import select

def main():
    with SessionLocal() as session:
        user = session.execute(select(User).where(User.email == 'admin@kamlog.cm')).scalars().first()
        if user:
            user.hashed_password = get_password_hash('admin123')
            session.commit()
            print('Password reset successfully!')
        else:
            print('User not found')

if __name__ == '__main__':
    main()
