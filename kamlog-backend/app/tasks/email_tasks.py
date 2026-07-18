
from celery import shared_task
from app.utils.notifications import send_email

@shared_task
def send_email_async(subject: str, recipients: list, html_content: str):
    '''Celery task to send email asynchronously.'''
    return send_email(subject, recipients, html_content)

