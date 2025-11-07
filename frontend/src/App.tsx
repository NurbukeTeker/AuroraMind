import { useState } from "react";
import axios from "axios";

interface AnalysisResult {
  emotion: string;
  confidence: number;
  color: string;
}

function App() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post<AnalysisResult>("http://127.0.0.1:8000/analyze", { text });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Could not connect to the backend 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-white transition-all duration-700"
      style={{
        background: result
          ? `radial-gradient(circle at center, ${result.color} 0%, #000000 100%)`
          : "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
      }}
    >
      <h1 className="text-6xl font-extrabold mb-10 drop-shadow-lg tracking-wide">
        Aurora<span className="text-gray-200">Mind</span>
      </h1>

      <div className="flex flex-col items-center bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-xl w-[420px]">
        <textarea
          className="w-full h-28 p-4 text-black text-lg rounded-lg shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Type something to reveal your aura..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={analyzeText}
          disabled={loading}
          className="mt-5 px-8 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow-md hover:bg-yellow-300 transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div className="mt-8 text-center animate-fadeIn">
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
