import { useState, useEffect } from "react";
import axios from "axios";

interface AnalysisResult {
  emotion: string;
  confidence: number;
  color: string;
}

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // backend'e istek
  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post<AnalysisResult>("http://127.0.0.1:8000/analyze", { text });
      setResult(res.data);
    } catch {
      alert("Could not connect to the backend 😢");
    } finally {
      setLoading(false);
    }
  };

  // Arka plan rengini dinamik güncelle
  useEffect(() => {
    const auraColor = result ? result.color : "#000000";
    const root = document.getElementById("root");
    if (root) {
      root.style.background = `radial-gradient(circle at center, ${auraColor} 0%, #000000 100%)`;
    }
  }, [result]);

  return (
    <div className="flex flex-col items-center justify-center text-white text-center space-y-6 z-10">
      <h1 className="text-7xl font-extrabold drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
        Aurora<span className="text-gray-300">Mind</span>
      </h1>

      <textarea
        className="w-[400px] h-28 p-4 text-black text-lg rounded-lg shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="Type something to reveal your aura..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={analyzeText}
        disabled={loading}
        className="px-8 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow-md hover:bg-yellow-300 transition"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="animate-fadeIn">
          <h2 className="text-3xl font-bold capitalize">{result.emotion}</h2>
          <p className="text-gray-200 mt-2">
            Confidence: {Math.round(result.confidence * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
