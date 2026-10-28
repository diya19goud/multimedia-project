from fastapi import APIRouter, Query
from backend.schemas.weather import WeatherAdvisoryResponse
from backend.services.weather_engine import WeatherEngineService

router = APIRouter(prefix="/weather", tags=["Weather-Aware Construction Advisory"])

@router.get("/advisory", response_model=WeatherAdvisoryResponse)
def get_site_weather_advisory(location: str = Query("Austin, TX", description="Site city / region")):
    """
    Returns real-time construction hazards (concrete thermal heat, crane wind limits, roofing moisture) and 7-day trade feasibility.
    """
    return WeatherEngineService.get_advisory(location=location)

@router.get("/locations")
def get_available_weather_locations():
    """
    Returns list of monitored project job site locations.
    """
    return list(WeatherEngineService.CITIES_DATA.keys())
