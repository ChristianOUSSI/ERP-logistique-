
from celery import Celery
from app.config import settings

def make_celery():
    celery = Celery(
        __name__,
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND,
        include=[
            'app.tasks.email_tasks',
            'app.tasks.pdf_tasks',
            'app.tasks.finance_tasks',
            'app.tasks.magasin_tasks',
        ]
    )
    # Optional configuration
    celery.conf.update(
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,
    )
    return celery

celery_app = make_celery()
