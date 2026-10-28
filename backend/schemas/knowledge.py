from typing import List, Optional
from pydantic import BaseModel, Field

class KnowledgeArticle(BaseModel):
    id: str
    code_id: str = Field(..., description="e.g. 'ACI 318-19', 'OSHA 1926.501'")
    title: str
    category: str
    jurisdiction: str
    summary: str
    key_clauses: List[str]
    mandatory_tolerances: List[str]
    inspection_checklist: List[str]
    risk_level_if_violated: str
    tags: List[str]

class KnowledgeSearchRequest(BaseModel):
    query: Optional[str] = ""
    category: Optional[str] = "All"
    jurisdiction: Optional[str] = "All"
    tag: Optional[str] = None

class KnowledgeSearchResponse(BaseModel):
    total_results: int
    articles: List[KnowledgeArticle]
    available_categories: List[str]
    available_jurisdictions: List[str]
