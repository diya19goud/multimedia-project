from fastapi import APIRouter
from backend.schemas.valuation import ValuationRequest, ValuationResponse
from backend.services.valuation_engine import ValuationEngineService

router = APIRouter(prefix="/valuation", tags=["Real Estate Valuation & Cost Estimator"])

@router.post("/calculate", response_model=ValuationResponse)
def calculate_valuation(req: ValuationRequest):
    """
    Computes comprehensive construction cost breakdown, market valuation, developer ROI scenarios, and cashflow S-curve.
    """
    return ValuationEngineService.calculate(req)

@router.get("/options")
def get_valuation_options():
    """
    Returns available project types, locations, materials, and amenity packages for calculator inputs.
    """
    return {
        "locations": list(ValuationEngineService.LOCATION_FACTORS.keys()),
        "project_types": list(ValuationEngineService.PROJECT_BASE_COST_PER_SQFT.keys()),
        "qualities": list(ValuationEngineService.QUALITY_MULTIPLIERS.keys()),
        "structural_systems": list(ValuationEngineService.STRUCTURAL_SYSTEM_MULTIPLIERS.keys()),
        "amenities": list(ValuationEngineService.AMENITY_COSTS.keys()),
        "topographies": ["Flat / Level", "Sloped / Hillside (+8%)", "High Water Table / Deep Piling (+12%)"]
    }
