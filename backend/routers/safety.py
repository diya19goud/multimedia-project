from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form
from backend.schemas.safety import (
    SafetyAnalysisResponse,
    SafetyChecklistRequest
)
from backend.services.ai_vision import AIVisionService

router = APIRouter(prefix="/safety", tags=["Site Safety Monitoring"])

@router.post("/analyze-image", response_model=SafetyAnalysisResponse)
async def analyze_site_image(
    file: Optional[UploadFile] = File(None),
    preset: Optional[str] = Form(None)
):
    """
    Multimodal AI Endpoint for Site Safety & PPE Detection.
    Accepts uploaded site photo or simulated preset ('violation', 'compliant', 'hazard').
    """
    image_bytes = None
    filename = "sample_site_frame.jpg"
    if file:
        filename = file.filename or "uploaded_site.jpg"
        image_bytes = await file.read()

    return AIVisionService.analyze_site_safety(
        image_bytes=image_bytes,
        filename=filename,
        preset=preset
    )

@router.post("/evaluate-checklist", response_model=SafetyAnalysisResponse)
def evaluate_checklist(req: SafetyChecklistRequest):
    """
    Analyzes site safety checklist parameters and generates OSHA compliance score & action plan.
    """
    return AIVisionService.evaluate_safety_checklist(req)

@router.get("/samples")
def get_safety_samples():
    """
    Returns pre-configured site inspection scenarios for instantaneous testing.
    """
    return [
        {
            "id": "scenario_violation",
            "name": "High-Rise Elevated Edge & Crane Swing Zone",
            "description": "Active slab work with worker without hard hat and missing fall arrest tie-off.",
            "preset": "violation",
            "preview_url": "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "id": "scenario_compliant",
            "name": "Heavy Civil Structural Deck (Fully Compliant)",
            "description": "Rigging team with 100% PPE compliance, certified guardrails and dual lanyards.",
            "preset": "compliant",
            "preview_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "id": "scenario_caution",
            "name": "Substructure Foundation & Dowel Zone",
            "description": "Protruding vertical rebar dowels requiring safety caps and visibility warning.",
            "preset": "hazard",
            "preview_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
        }
    ]
