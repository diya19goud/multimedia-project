from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class CostCategoryItem(BaseModel):
    category: str
    amount_usd: float
    percentage: float
    description: str

class ValuationScenario(BaseModel):
    scenario: str
    valuation_usd: float
    cost_usd: float
    net_equity_gain: float
    roi_percentage: float

class MonthlyCashflow(BaseModel):
    month: int
    phase_name: str
    monthly_expense_usd: float
    cumulative_spend_usd: float
    cumulative_progress_pct: float

class ValuationRequest(BaseModel):
    location: str = Field("Austin, TX - Metro Corridor", description="Project region")
    project_type: str = Field("Commercial Office", description="Asset class")
    built_up_area_sqft: float = Field(25000.0, ge=500.0, le=1000000.0)
    floors_count: int = Field(4, ge=1, le=100)
    construction_quality: str = Field("Premium / Grade A", description="Material quality tier")
    structural_system: str = Field("Reinforced Concrete (RCC)", description="Frame type")
    finishes_grade: str = Field("Executive", description="Interior finishes")
    amenities: List[str] = Field(default_factory=lambda: ["Underground Parking", "Central HVAC VRF", "Smart Building BMS", "Rooftop Solar PV"])
    site_topography: str = Field("Flat / Level", description="Soil & slope condition")

class ValuationResponse(BaseModel):
    project_summary: str
    total_estimated_cost_usd: float
    estimated_market_valuation_usd: float
    cost_per_sqft: float
    valuation_per_sqft: float
    developer_margin_pct: float
    estimated_duration_months: int
    cost_breakdown: List[CostCategoryItem]
    scenarios: List[ValuationScenario]
    cashflow_curve: List[MonthlyCashflow]
    key_drivers: List[str]
