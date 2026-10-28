from typing import List, Optional
from pydantic import BaseModel, Field

class WeatherMetric(BaseModel):
    temperature_c: float
    temperature_f: float
    feels_like_c: float
    humidity_pct: int
    wind_speed_kph: float
    wind_gusts_kph: float
    rain_probability_pct: int
    uv_index: int
    condition: str
    condition_icon: str

class TradeFeasibility(BaseModel):
    trade_name: str
    status: str = Field(..., description="'Optimal', 'Caution', 'Halt / Prohibited'")
    risk_level: str = Field(..., description="'Low', 'Moderate', 'High', 'Extreme'")
    restriction_reason: str
    protective_measures: List[str]

class DayForecastItem(BaseModel):
    day_name: str
    date_str: str
    high_temp_c: float
    low_temp_c: float
    condition: str
    precipitation_chance: int
    wind_max_kph: float
    overall_site_status: str = Field(..., description="'Optimal Site Work', 'Weather Caution', 'Stop Work Warning'")
    concrete_suitability: str
    crane_suitability: str
    earthwork_suitability: str

class WeatherAdvisoryResponse(BaseModel):
    location: str
    recorded_at: str
    current_metrics: WeatherMetric
    overall_site_risk: str = Field(..., description="'Low Risk - Operations Normal', 'Moderate Risk - Mitigations Required', 'High Risk - High Hazard Conditions'")
    critical_alerts: List[str]
    trade_advisories: List[TradeFeasibility]
    forecast_7day: List[DayForecastItem]
    concrete_curing_guidelines: List[str]
    osha_heat_cold_protocols: List[str]
