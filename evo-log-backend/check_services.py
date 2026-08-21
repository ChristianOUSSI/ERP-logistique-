import os

services = {
    'auth_service': 'AuthService',
    'transport_service': 'TransportService',
    'finance_service': 'FinanceService',
    'magasin_service': 'MagasinService',
    'acconage_service': 'AcconageService',
    'transit_service': 'TransitService',
    'parc_service': 'ParcService',
    'qhse_service': 'QHSEService',
    'maintenance_service': 'MaintenanceService',
    'notification_service': 'NotificationService',
    'reporting_service': 'ReportingService',
    'integration_service': 'IntegrationService',
    'tiers_service': 'TiersService',
}

for filename, classname in services.items():
    filepath = os.path.join('app', 'services', filename + '.py')
    if not os.path.exists(filepath):
        print(f"{classname}: FILE NOT FOUND ({filepath})")
        continue
    content = open(filepath, encoding='utf-8').read()
    if f'class {classname}' in content:
        print(f"{classname}: OK")
    else:
        # Find what classes DO exist
        import re
        classes = re.findall(r'^class (\w+)', content, re.MULTILINE)
        print(f"{classname}: MISSING - available: {classes}")
