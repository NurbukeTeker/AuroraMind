import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

color_map = {
    "joy": "#FFD93D",
    "love": "#FF85B3",
    "anger": "#FF4B4B",
    "sadness": "#4F86F7",
    "fear": "#7C83A5",
    "surprise": "#7AE7FF",
    "disgust": "#6A994E",
    "neutral": "#9CA3AF",
    "optimism": "#7CFC00"
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
