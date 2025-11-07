from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

color_map = {
    "joy": "#FFD93D",
    "optimism": "#7CFC00",
    "sadness": "#4F86F7",
    "anger": "#FF5A5F",
    "fear": "#A0A0A0",
    "love": "#FF85B3"
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
