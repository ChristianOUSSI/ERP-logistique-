# app/services  Import tous les services
from app.services import transport_service, finance_service, parc_service
from app.services import goods_declaration_service, removal_slip_service, reception_mag3_service, suppliers_service
from app.services import mag3_workflow_service, notification_service

__all__ = ["transport_service", "finance_service", "parc_service", "goods_declaration_service", "removal_slip_service", "reception_mag3_service", "suppliers_service", "mag3_workflow_service", "notification_service"]
