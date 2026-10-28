from typing import Optional
from fastapi import APIRouter, HTTPException
from backend.schemas.knowledge import (
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
    KnowledgeArticle
)
from backend.services.knowledge_engine import KnowledgeEngineService

router = APIRouter(prefix="/knowledge", tags=["Construction Knowledge Base"])

@router.post("/search", response_model=KnowledgeSearchResponse)
def search_knowledge_base(req: KnowledgeSearchRequest):
    """
    Search construction codes, OSHA standards, and engineering guidelines.
    """
    return KnowledgeEngineService.search(req)

@router.get("/article/{article_id}", response_model=KnowledgeArticle)
def get_article_detail(article_id: str):
    """
    Fetch full specifications and checklists for a standard.
    """
    for a in KnowledgeEngineService.ARTICLES:
        if a.id.lower() == article_id.lower() or a.code_id.lower() == article_id.lower():
            return a
    raise HTTPException(status_code=404, detail="Standard or code not found in knowledge base.")
