import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"
DEFAULT_SYSTEM_PROMPT = (
    "You are Krishi Margadarshan AI, an agriculture assistant for Nepal. "
    "Give practical, safe, and concise farming advice for crops, weather, soil, livestock, and irrigation. "
    "If the user asks non-agriculture topics, answer briefly and politely redirect to agriculture help."
)


def _build_contents(message, history):
    contents = []
    if isinstance(history, list):
        for item in history[-10:]:
            if not isinstance(item, dict):
                continue
            text = str(item.get("text", "")).strip()
            role = str(item.get("role", "user")).strip().lower()
            if not text:
                continue
            gemini_role = "model" if role in {"assistant", "model", "bot"} else "user"
            contents.append({"role": gemini_role, "parts": [{"text": text}]})

    contents.append({"role": "user", "parts": [{"text": message}]})
    return contents


def _extract_text(payload):
    candidates = payload.get("candidates") or []
    if not candidates:
        return ""

    first_candidate = candidates[0] or {}
    parts = (first_candidate.get("content") or {}).get("parts") or []
    text_chunks = [str(part.get("text", "")) for part in parts if isinstance(part, dict) and part.get("text")]
    return "\n".join(chunk for chunk in text_chunks if chunk).strip()


class GeminiChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = str(request.data.get("message", "")).strip()
        history = request.data.get("history")

        if not message:
            return Response(
                {"detail": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            return Response(
                {"detail": "Gemini API key is missing. Set GEMINI_API_KEY in backend/.env or project-root .env."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        model_name = os.getenv("GEMINI_MODEL", DEFAULT_GEMINI_MODEL).strip() or DEFAULT_GEMINI_MODEL
        system_prompt = os.getenv("GEMINI_SYSTEM_PROMPT", DEFAULT_SYSTEM_PROMPT).strip() or DEFAULT_SYSTEM_PROMPT

        request_body = {
            "systemInstruction": {
                "parts": [{"text": system_prompt}],
            },
            "contents": _build_contents(message, history),
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 512,
            },
        }

        url = f"{GEMINI_API_BASE_URL}/models/{model_name}:generateContent?key={api_key}"
        encoded_body = json.dumps(request_body).encode("utf-8")
        http_request = Request(
            url,
            data=encoded_body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urlopen(http_request, timeout=25) as api_response:
                payload = json.loads(api_response.read().decode("utf-8"))
        except HTTPError as error:
            error_payload = {}
            try:
                error_payload = json.loads(error.read().decode("utf-8"))
            except Exception:
                error_payload = {}

            detail = (
                (error_payload.get("error") or {}).get("message")
                or "Gemini service returned an error."
            )
            return Response({"detail": detail}, status=status.HTTP_502_BAD_GATEWAY)
        except URLError:
            return Response(
                {"detail": "Unable to reach Gemini service."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception:
            return Response(
                {"detail": "Unexpected error while generating chatbot response."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        reply_text = _extract_text(payload)
        if not reply_text:
            return Response(
                {"detail": "Gemini returned an empty response."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "message": message,
                "reply": reply_text,
                "model": model_name,
            }
        )
