
from celery import shared_task
from app.utils.notifications import _send_email_sync

@shared_task
def send_email_async(subject: str, recipients: list, html_content: str):
    '''Celery task to send email asynchronously.'''
    return _send_email_sync(subject, recipients, html_content)

