from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form
from backend.schemas.cracks import CrackAnalysisResponse
from backend.services.ai_vision import AIVisionService

router = APIRouter(prefix="/cracks", tags=["Structural Crack Detection"])

@router.post("/analyze-image", response_model=CrackAnalysisResponse)
async def analyze_crack_image(
    file: Optional[UploadFile] = File(None),
    preset_severity: Optional[str] = Form(None)
):
    """
    Multimodal AI Endpoint for Structural Crack Classification & Risk Scoring.
    Accepts uploaded crack photo or preset severity ('Minor', 'Moderate', 'Severe').
    """
    image_bytes = None
    filename = "crack_investigation.jpg"
    if file:
        filename = file.filename or "uploaded_crack.jpg"
        image_bytes = await file.read()

    return AIVisionService.analyze_structural_crack(
        image_bytes=image_bytes,
        filename=filename,
        preset_severity=preset_severity
    )

@router.get("/samples")
def get_crack_samples():
    """
    Returns pre-loaded structural crack sample scenarios for immediate interactive testing.
    """
    return [
        {
            "id": "sample_severe",
            "name": "Severe 45° Diagonal Shear Fracture",
            "element": "RC Transfer Girder",
            "severity": "Severe",
            "width": "3.8 mm",
            "risk_score": 88,
            "preview_url": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "id": "sample_moderate",
            "name": "Moderate Thermal Shrinkage Fissure",
            "element": "Basement Retaining Wall",
            "severity": "Moderate",
            "width": "0.75 mm",
            "risk_score": 52,
            "preview_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
        },
        {
            "id": "sample_minor",
            "name": "Minor Hairline Surface Crazing",
            "element": "Slab Screed Finish",
            "severity": "Minor",
            "width": "0.18 mm",
            "risk_score": 19,
            "preview_url": "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80"
        }
    ]
