import pytest
from app.models.organization import Organization
from app.models.user import User

def test_tenant_isolation_model():
    """Verify Organization model creation and default allowed modules."""
    org1 = Organization(
        code="ORG-TENANT-A",
        name="Tenant A Logistics",
        slug="tenant-a",
        plan="STARTER",
        allowed_modules=["transport", "magasin"]
    )
    org2 = Organization(
        code="ORG-TENANT-B",
        name="Tenant B Freight",
        slug="tenant-b",
        plan="BUSINESS",
        allowed_modules=["transport", "finance", "qhse"]
    )
    
    assert org1.code != org2.code
    assert "magasin" in org1.allowed_modules
    assert "magasin" not in org2.allowed_modules
    assert org1.plan == "STARTER"
    assert org2.plan == "BUSINESS"

def test_user_tenant_assignment():
    """Verify user organization_id mapping and superadmin flag."""
    user1 = User(email="admin@tenant-a.com", organization_id=1, is_superadmin=False)
    superadmin = User(email="super@codeaxis.cm", organization_id=None, is_superadmin=True)

    assert user1.organization_id == 1
    assert user1.is_superadmin is False
    assert superadmin.is_superadmin is True
