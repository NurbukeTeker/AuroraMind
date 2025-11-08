from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# ✅ CORS ayarı — Frontend'e izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için tüm kaynaklara izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

color_map = {
    "joy": "#FFD93D",        # gold
    "love": "#FF85B3",       # pink
    "anger": "#FF4B4B",      # red
    "sadness": "#4F86F7",    # blue
    "fear": "#7C83A5",       # slate/indigo
    "surprise": "#7AE7FF",   # cyan
    "disgust": "#6A994E",    # green
    "neutral": "#9CA3AF",    # gray (soft, beyaz değil)
    "optimism": "#7CFC00"    # lime (ekstra label gelirse)
}


class TextInput(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(input: TextInput):
    result = model(input.text)[0]
    emotion = result["label"]
    confidence = round(result["score"], 3)
    color = color_map.get(emotion.lower(), "#FFFFFF")
    return {"emotion": emotion, "confidence": confidence, "color": color}
