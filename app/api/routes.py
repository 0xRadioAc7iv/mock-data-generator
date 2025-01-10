import json
from fastapi import Request, APIRouter
from fastapi.responses import StreamingResponse
from app.services import get_gemini_response

router = APIRouter()

@router.post("/")
async def get_json_response(request: Request):
    try:
        body = await request.json()
        query = body["query"]

        if query is None:
            return { "results": "No query provided" }

        return StreamingResponse(
            merge_and_stream(query=query),
            media_type="application/json"
        )
    except Exception as e:
        return {"error": f"There was an error: {e}"}

async def merge_and_stream(query: str):
    accumulated_response = ""
    try:
        async for chunk in get_gemini_response(query=query):
            chunk_data = json.loads(chunk)

            if "data" in chunk_data:
                accumulated_response += chunk_data["data"]

            yield json.dumps({"partial_response": accumulated_response}) + "\n"

        yield json.dumps({"final_response": accumulated_response}) + "\n"
    except Exception as e:
        yield json.dumps({"error": f"There was an error: {e}"}) + "\n"