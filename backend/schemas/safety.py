from typing import List, Optional
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x: float = Field(..., description="X coordinate percentage (0-100)")
    y: float = Field(..., description="Y coordinate percentage (0-100)")
    width: float = Field(..., description="Width percentage (0-100)")
    height: float = Field(..., description="Height percentage (0-100)")
    label: str = Field(..., description="Detected object label")
    confidence: float = Field(..., description="Detection confidence 0.0-1.0")
    status: str = Field(..., description="'compliant', 'violation', or 'hazard'")

class SafetyViolation(BaseModel):
    id: str
    category: str
    severity: str = Field(..., description="'Low', 'Moderate', 'High', or 'Critical'")
    description: str
    recommendation: str
    osha_reference: Optional[str] = None
    box: Optional[BoundingBox] = None

class PPEComplianceItem(BaseModel):
    item_name: str
    detected: int
    required: int
    compliance_rate: float
    status: str = Field(..., description="'Compliant' or 'Non-Compliant'")

class SafetyAnalysisResponse(BaseModel):
    analysis_id: str
    filename: str
    timestamp: str
    overall_safety_score: int = Field(..., ge=0, le=100)
    status: str = Field(..., description="'Safe', 'Caution Needed', 'Critical Violations'")
    workers_detected: int
    ppe_compliance_rate: float
    ppe_items: List[PPEComplianceItem]
    violations: List[SafetyViolation]
    hazards_detected: List[str]
    bounding_boxes: List[BoundingBox]
    executive_summary: str
    corrective_actions: List[str]

class SafetyChecklistRequest(BaseModel):
    site_zone: str = Field("Zone A - High Rise Sector", description="Active construction zone")
    worker_count: int = Field(12, ge=1)
    hard_hats_checked: bool = True
    hi_vis_checked: bool = True
    safety_boots_checked: bool = True
    eye_protection_checked: bool = True
    fall_harnesses_checked: bool = True
    scaffolding_inspected: bool = True
    fire_extinguishers_accessible: bool = True
    first_aid_station_ready: bool = True
    hot_work_permit_valid: bool = True
    notes: Optional[str] = ""
