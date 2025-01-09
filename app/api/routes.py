import json
from fastapi import Request, APIRouter
from app.services import get_gemini_response

router = APIRouter()

@router.post("/")
async def get_json_response(request: Request):
    try:
        body = await request.json()
        query = body["query"]

        if query is None:
            return {"query": None, "results": "No query provided"}

        gemini_response = await get_gemini_response(query)
        response = json.loads(gemini_response["response"])
        return {"query": query, "results": response}
    except Exception as e:
        return {"error": f"There was an error: {e}"}