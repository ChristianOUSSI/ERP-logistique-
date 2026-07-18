# app/routers/sustainability.py - Routes API pour le suivi de durabilité
from app.utils.rbac import require_role
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.models.user import User

from app.services.sustainability_service import sustainability_service, TransportMode, EmissionScope

router = APIRouter(prefix="/api/v1/sustainability", tags=["Sustainability"])


@router.post("/emissions/record")
    @require_role(["admin", "manager"])
def record_carbon_emission(
    source: str = Body(...),
    amount_kg_co2e: float = Body(...),
    scope: str = Body(...),
    description: Optional[str] = Body(None),
    metadata: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enregistre une émission de carbone.
    """
    # Vérifier les permissions
    # check_permission("sustainability:emission:record")(current_user)

    try:
        # Parser le scope d'émission
        try:
            scope_enum = EmissionScope(scope.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid emission scope. Supported scopes: {[es.value for es in EmissionScope]}"
            )

        record = sustainability_service.record_carbon_emission(
            source=source,
            amount_kg_co2e=amount_kg_co2e,
            scope=scope_enum,
            description=description,
            metadata=metadata
        )

        return {
            "id": record["id"],
            "source": record["source"],
            "amount_kg_co2e": record["amount_kg_co2e"],
            "scope": record["scope"],
            "description": record["description"],
            "timestamp": record["timestamp"]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/emissions/transport")
    @require_role(["admin", "manager"])
def calculate_and_record_transport_emissions(
    distance_km: float = Body(..., gt=0),
    weight_tonnes: float = Body(..., gt=0),
    transport_mode: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcule et enregistre les émissions de carbone pour un transport donné.
    """
    # Vérifier les permissions
    # check_permission("sustainability:emission:transport")(current_user)

    try:
        # Parser le mode de transport
        try:
            transport_enum = TransportMode(transport_mode.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid transport mode. Supported modes: {[tm.value for tm in TransportMode]}"
            )

        emissions = sustainability_service.calculate_transport_emissions(
            distance_km=distance_km,
            weight_tonnes=weight_tonnes,
            transport_mode=transport_enum
        )

        return {
            "distance_km": distance_km,
            "weight_tonnes": weight_tonnes,
            "transport_mode": transport_mode,
            "emissions_kg_co2e": emissions,
            "emissions_tonnes_co2e": emissions / 1000,
            "message": "Transport emissions calculated and recorded",
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/emissions/warehouse")
    @require_role(["admin", "manager"])
def calculate_and_record_warehouse_emissions(
    volume_m3: float = Body(..., gt=0),
    days: float = Body(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcule et enregistre les émissions de carbone liées à l'entreposage.
    """
    # Vérifier les permissions
    # check_permission("sustainability:emission:warehouse")(current_user)

    emissions = sustainability_service.calculate_warehouse_emissions(
        volume_m3=volume_m3,
        days=days
    )

    return {
        "volume_m3": volume_m3,
        "days": days,
        "emissions_kg_co2e": emissions,
        "emissions_tonnes_co2e": emissions / 1000,
        "message": "Warehouse emissions calculated and recorded",
        "timestamp": datetime.now().isoformat()
    }


@router.post("/shipments")
    @require_role(["admin", "manager"])
def record_shipment(
    origin: str = Body(...),
    destination: str = Body(...),
    weight_tonnes: float = Body(..., gt=0),
    transport_mode: str = Body(...),
    distance_km: Optional[float] = Body(None),
    departed_at: Optional[str] = Body(None),
    arrived_at: Optional[str] = Body(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enregistre une expédition et calcule ses émissions associées.
    """
    # Vérifier les permissions
    # check_permission("sustainability:shipment:record")(current_user)

    try:
        # Parser le mode de transport
        try:
            transport_enum = TransportMode(transport_mode.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid transport mode. Supported modes: {[tm.value for tm in TransportMode]}"
            )

        # Parser les timestamps si fournis
        parsed_departed_at = None
        if departed_at:
            try:
                parsed_departed_at = datetime.fromisoformat(departed_at)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid departed_at format. Use ISO format")

        parsed_arrived_at = None
        if arrived_at:
            try:
                parsed_arrived_at = datetime.fromisoformat(arrived_at)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid arrived_at format. Use ISO format")

        shipment = sustainability_service.record_shipment(
            origin=origin,
            destination=destination,
            weight_tonnes=weight_tonnes,
            transport_mode=transport_enum,
            distance_km=distance_km,
            departed_at=parsed_departed_at,
            arrived_at=parsed_arrived_at
        )

        return {
            "id": shipment["id"],
            "origin": shipment["origin"],
            "destination": shipment["destination"],
            "weight_tonnes": shipment["weight_tonnes"],
            "transport_mode": shipment["transport_mode"],
            "distance_km": shipment["distance_km"],
            "departed_at": shipment["departed_at"],
            "arrived_at": shipment["arrived_at"],
            "transport_emissions_kg_co2e": shipment["transport_emissions_kg_co2e"],
            "handling_emissions_kg_co2e": shipment["handling_emissions_kg_co2e"],
            "total_emissions_kg_co2e": shipment["total_emissions_kg_co2e"],
            "timestamp": shipment["timestamp"]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/footprint")
def get_carbon_footprint(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    scope: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calcule l'empreinte carbone sur une période donnée.
    """
    # Vérifier les permissions
    # check_permission("sustainability:footprint:read")(current_user)

    try:
        # Parser les dates si fournies
        parsed_start_date = None
        if start_date:
            try:
                parsed_start_date = datetime.fromisoformat(start_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO format")

        parsed_end_date = None
        if end_date:
            try:
                parsed_end_date = datetime.fromisoformat(end_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use ISO format")

        # Parser le scope si fourni
        parsed_scope = None
        if scope:
            try:
                parsed_scope = EmissionScope(scope.lower())
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid emission scope. Supported scopes: {[es.value for es in EmissionScope]}"
                )

        footprint = sustainability_service.get_carbon_footprint(
            start_date=parsed_start_date,
            end_date=parsed_end_date,
            scope=parsed_scope,
            source=source
        )

        return footprint

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/transportation/efficiency")
def get_transportation_efficiency_report(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère un rapport d'efficacité des transports.
    """
    # Vérifier les permissions
    # check_permission("sustainability:transportation:efficiency")(current_user)

    try:
        # Parser les dates si fournies
        parsed_start_date = None
        if start_date:
            try:
                parsed_start_date = datetime.fromisoformat(start_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO format")

        parsed_end_date = None
        if end_date:
            try:
                parsed_end_date = datetime.fromisoformat(end_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use ISO format")

        report = sustainability_service.get_transportation_efficiency_report(
            start_date=parsed_start_date,
            end_date=parsed_end_date
        )

        return report

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/route/green")
def suggest_green_route(
    origin: str = Query(...),
    destination: str = Query(...),
    weight_tonnes: float = Query(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Suggère l'itinéraire le plus vert pour une expédition donnée.
    """
    # Vérifier les permissions
    # check_permission("sustainability:route:green")(current_user)

    suggestion = sustainability_service.suggest_green_route(
        origin=origin,
        destination=destination,
        weight_tonnes=weight_tonnes
    )

    return suggestion


@router.get("/dashboard")
def get_sustainability_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère un tableau de bord de durabilité avec les métriques clés.
    """
    # Vérifier les permissions
    # check_permission("sustainability:dashboard")(current_user)

    dashboard = sustainability_service.get_sustainability_dashboard()
    return dashboard


@router.get("/emissions/history")
def get_emission_history(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère l'historique des émissions de carbone.
    """
    # Vérifier les permissions
    # check_permission("sustainability:emission:history")(current_user)

    try:
        # Parser les dates si fournies
        parsed_start_date = None
        if start_date:
            try:
                parsed_start_date = datetime.fromisoformat(start_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO format")

        parsed_end_date = None
        if end_date:
            try:
                parsed_end_date = datetime.fromisoformat(end_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use ISO format")

        # Filtrer l'historique des enregistrements de carbone
        records = sustainability_service.carbon_records

        if parsed_start_date:
            records = [r for r in records if datetime.fromisoformat(r["timestamp"]) >= parsed_start_date]
        if parsed_end_date:
            records = [r for r in records if datetime.fromisoformat(r["timestamp"]) <= parsed_end_date]

        # Limiter le nombre d'enregistrements
        records = records[-limit:] if len(records) > limit else records
        records.reverse()  # Plus récent en premier

        return {
            "emissions": records,
            "count": len(records),
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/shipments/history")
def get_shipment_history(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère l'historique des expéditions.
    """
    # Vérifier les permissions
    # check_permission("sustainability:shipment:history")(current_user)

    try:
        # Parser les dates si fournies
        parsed_start_date = None
        if start_date:
            try:
                parsed_start_date = datetime.fromisoformat(start_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO format")

        parsed_end_date = None
        if end_date:
            try:
                parsed_end_date = datetime.fromisoformat(end_date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_date format. Use ISO format")

        # Filtrer l'historique des expéditions
        shipments = sustainability_service.shipments

        if parsed_start_date:
            shipments = [s for s in shipments if datetime.fromisoformat(s["timestamp"]) >= parsed_start_date]
        if parsed_end_date:
            shipments = [s for s in shipments if datetime.fromisoformat(s["timestamp"]) <= parsed_end_date]

        # Limiter le nombre d'enregistrements
        shipments = shipments[-limit:] if len(shipments) > limit else shipments
        shipments.reverse()  # Plus récent en premier

        return {
            "shipments": shipments,
            "count": len(shipments),
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")