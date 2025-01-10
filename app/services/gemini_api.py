import os
import httpx
import json
from fastapi import HTTPException
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  # "response_schema": content.Schema(
  #   type = content.Type.OBJECT,
  #   properties = {
  #     "response": content.Schema(
  #       type = content.Type.STRING,
  #     ),
  #   },
  # ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
  system_instruction="You are a highly intelligent assistant specializing in generating realistic, randomized, real-life data based on provided database schemas. Given a schema, your task is to create a JSON array containing sample data for each field of the schema. The data should be diverse, plausible, and align with the field types and constraints provided. Generate data for at least 15 products.",
)

async def get_gemini_response(query: str):
    try:
        for chunk in model.generate_content(query, stream=True):
            yield json.dumps({"data": chunk.text}) + "\n"
    except Exception as exc:
        yield json.dumps({"error": f"An error occurred: {exc}"}) + "\n"