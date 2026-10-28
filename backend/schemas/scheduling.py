from typing import List, Optional
from pydantic import BaseModel, Field

class GanttPhase(BaseModel):
    id: str
    phase_name: str
    category: str = Field(..., description="'Substructure', 'Superstructure', 'MEP', 'Finishes', 'Commissioning'")
    start_day: int
    duration_days: int
    end_day: int
    progress_pct: int = Field(..., ge=0, le=100)
    status: str = Field(..., description="'Completed', 'In Progress', 'Pending', 'Critical Path'")
    is_critical_path: bool
    contractor: str
    dependencies: List[str]
    delay_risk: str = Field(..., description="'Low', 'Medium', 'High'")
    risk_factors: List[str]

class Milestone(BaseModel):
    id: str
    title: str
    due_day: int
    phase_id: str
    status: str = Field(..., description="'Completed', 'On Track', 'At Risk', 'Delayed'")
    deliverable: str

class ScheduleOptimizationRequest(BaseModel):
    project_name: str = Field("Harborview Commercial Tower", description="Project title")
    total_budget_usd: float = Field(14500000.0, ge=10000.0)
    target_duration_months: int = Field(18, ge=1, le=120)
    buffer_weeks: int = Field(3, ge=0, le=12)
    selected_risk_factors: List[str] = Field(default_factory=lambda: ["Supply Chain Lead Time", "Monsoon Heavy Rainfalls", "Subcontractor Availability"])

class ScheduleAnalysisResponse(BaseModel):
    project_name: str
    total_planned_days: int
    current_day: int
    overall_progress_pct: float
    critical_path_duration_days: int
    projected_delay_days: int
    phases: List[GanttPhase]
    milestones: List[Milestone]
    critical_path_phases: List[str]
    ai_schedule_advisories: List[str]
