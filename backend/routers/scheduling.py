from fastapi import APIRouter
from backend.schemas.scheduling import (
    ScheduleOptimizationRequest,
    ScheduleAnalysisResponse
)
from backend.services.scheduling_engine import SchedulingEngineService

router = APIRouter(prefix="/scheduling", tags=["Project Planning & Scheduling"])

@router.post("/analyze", response_model=ScheduleAnalysisResponse)
def analyze_schedule(req: ScheduleOptimizationRequest):
    """
    Computes Gantt phases, critical path analysis, milestone tracker, and AI schedule risk advisories.
    """
    return SchedulingEngineService.get_schedule(req)

@router.get("/current", response_model=ScheduleAnalysisResponse)
def get_current_project_schedule():
    """
    Returns active project lifecycle schedule.
    """
    return SchedulingEngineService.get_schedule(ScheduleOptimizationRequest())
