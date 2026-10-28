from fastapi import APIRouter
from backend.schemas.chat import ChatRequest, ChatResponse
from backend.services.chat_engine import ChatEngineService

router = APIRouter(prefix="/chat", tags=["Daily Site Assistant & Chatbot"])

@router.post("/message", response_model=ChatResponse)
def post_chat_message(req: ChatRequest):
    """
    Multimodal conversational agent for site engineers and supervisors.
    """
    return ChatEngineService.generate_response(req)

@router.get("/quick-prompts")
def get_quick_prompts():
    """
    Returns high-utility prompts for fast site supervisor queries.
    """
    return [
        {
            "category": "Structural Engineering",
            "title": "Rebar Lap Length Calculation",
            "prompt": "Calculate tension and compression lap length for 25mm bars in M30 concrete under ACI 318."
        },
        {
            "category": "Safety & HSE",
            "title": "OSHA Scaffolding Guidelines",
            "prompt": "What are mandatory OSHA tie-off guidelines, guardrail heights, and inspection tagging for frame scaffolds above 10ft?"
        },
        {
            "category": "Supervisor Operations",
            "title": "Draft Daily Site Report",
            "prompt": "Draft today's site supervisor daily report for Level 7 concrete pour with headcount census and HSE review."
        },
        {
            "category": "Quality & Standards",
            "title": "High-Temp Concrete Curing",
            "prompt": "What are maximum permissible concrete delivery temperatures and ACI 305R curing measures for 35°C ambient weather?"
        }
    ]
