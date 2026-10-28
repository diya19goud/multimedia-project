from typing import List, Optional
from pydantic import BaseModel, Field

class CrackCoordinate(BaseModel):
    x: float
    y: float

class CrackAnnotation(BaseModel):
    id: str
    label: str
    severity: str
    confidence: float
    start_point: CrackCoordinate
    end_point: CrackCoordinate
    box_x: float
    box_y: float
    box_width: float
    box_height: float

class RemedialStep(BaseModel):
    step_number: int
    title: str
    procedure: str
    materials_required: List[str]
    labor_estimate_hours: float
    estimated_cost_usd: float

class CrackAnalysisResponse(BaseModel):
    analysis_id: str
    filename: str
    timestamp: str
    severity_level: str = Field(..., description="'Minor', 'Moderate', or 'Severe'")
    crack_type: str = Field(..., description="e.g. 'Shear Stress Crack', 'Plastic Shrinkage', 'Settlement Crack'")
    structural_risk_score: int = Field(..., ge=0, le=100)
    risk_classification: str = Field(..., description="'Low Risk', 'Moderate Concern', 'Severe Structural Threat'")
    estimated_max_width_mm: float
    estimated_depth_mm: float
    estimated_length_cm: float
    orientation: str = Field(..., description="'Diagonal / Shear', 'Vertical', 'Horizontal'")
    element_type: str = Field("Reinforced Concrete Beam", description="Affected structural component")
    propagation_risk: str = Field("High under dynamic seismic or cyclic loads")
    annotations: List[CrackAnnotation]
    engineering_assessment: str
    urgency: str = Field(..., description="'Routine (30-60 days)', 'Priority (7-14 days)', 'Immediate / Emergency (24h)'")
    remedial_actions: List[RemedialStep]
    building_code_citations: List[str]
