from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str
    timestamp: Optional[str] = None

class SiteContext(BaseModel):
    active_project: Optional[str] = "Skyline Corporate Center"
    current_phase: Optional[str] = "Structural RCC Pouring"
    ambient_temp_c: Optional[float] = 31.5
    wind_speed_kph: Optional[float] = 18.0

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = Field(default_factory=list)
    site_context: Optional[SiteContext] = None

class ChatResponse(BaseModel):
    reply: str
    cited_standards: List[str]
    suggested_followups: List[str]
    action_type: Optional[str] = None
    data_payload: Optional[Dict[str, Any]] = None
