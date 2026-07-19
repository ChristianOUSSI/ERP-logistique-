# app/utils/notifications.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any
from app.config import settings

from app.utils.logger import get_logger

logger = get_logger(__name__)

def _send_email_sync(subject: str, recipients: list, html_content: str):
    """Envoie un email via SMTP (synchronous version)."""
    if not settings.SMTP_HOST:
        logger.warning(f"SMTP host not configured. Email not sent: {subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = ", ".join(recipients)

    part = MIMEText(html_content, "html")
    msg.attach(part)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            if settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, recipients, msg.as_string())
        logger.info(f"Email sent successfully to {recipients}")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")

def send_email(subject: str, recipients: list, html_content: str):
    """Envoie un email de maniere asynchrone via Celery."""
    # Delegue a la tache Celery
    from app.tasks.email_tasks import send_email_async
    send_email_async.delay(subject, recipients, html_content)

class NotificationTemplates:
    @staticmethod
    def get_transport_alert(mission_id: int, message: str) -> str:
        return f"""
        <html>
            <body>
                <h2 style='color: red;'>Alerte Transport - Mission #{mission_id}</h2>
                <p>Un événement important s'est produit :</p>
                <div style='background-color: #fce4e4; padding: 15px; border-left: 4px solid red;'>
                    {message}
                </div>
            </body>
        </html>
        """

    @staticmethod
    def get_finance_payment_validation(invoice_id: str, amount: str) -> str:
        return f"""
        <html>
            <body>
                <h2 style='color: green;'>Paiement Validé</h2>
                <p>Le paiement pour la facture <strong>{invoice_id}</strong> a été validé.</p>
                <p>Montant: <strong>{amount}</strong></p>
            </body>
        </html>
        """

    @staticmethod
    def get_magasin_stock_alert(article_name: str, current_stock: int, min_stock: int) -> str:
        return f"""
        <html>
            <body>
                <h2 style='color: orange;'>Alerte Stock Minimum</h2>
                <p>L'article <strong>{article_name}</strong> a atteint son seuil d'alerte.</p>
                <ul>
                    <li>Stock actuel: {current_stock}</li>
                    <li>Stock minimum: {min_stock}</li>
                </ul>
            </body>
        </html>
        """

class NotificationService:
    # Destinataires par défaut par module
    RECIPIENTS = {
        "transport": ["dispatch@kamlog.cm", "transport-manager@kamlog.cm"],
        "finance": ["comptabilite@kamlog.cm", "daf@kamlog.cm"],
        "magasin": ["magasinier@kamlog.cm", "supply-chain@kamlog.cm"],
    }

    @classmethod
    def trigger_transport_alert(cls, mission_id: int, message: str, extra_recipients: list = []):
        html = NotificationTemplates.get_transport_alert(mission_id, message)
        recipients = cls.RECIPIENTS["transport"] + extra_recipients
        from app.tasks.email_tasks import send_email_async
        send_email_async.delay(f"Alerte Transport #{mission_id}", recipients, html)

    @classmethod
    def trigger_payment_validation(cls, invoice_id: str, amount: str, extra_recipients: list = []):
        html = NotificationTemplates.get_finance_payment_validation(invoice_id, amount)
        recipients = cls.RECIPIENTS["finance"] + extra_recipients
        from app.tasks.email_tasks import send_email_async
        send_email_async.delay(f"Paiement Validé - {invoice_id}", recipients, html)

    @classmethod
    def trigger_stock_alert(cls, article_name: str, current_stock: int, min_stock: int, extra_recipients: list = []):
        html = NotificationTemplates.get_magasin_stock_alert(article_name, current_stock, min_stock)
        recipients = cls.RECIPIENTS["magasin"] + extra_recipients
        from app.tasks.email_tasks import send_email_async
        send_email_async.delay(f"Alerte Stock - {article_name}", recipients, html)
