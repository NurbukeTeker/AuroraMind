import { useState } from "react";
import axios from "axios";
import "./App.css";

interface AnalysisResult {
  emotion: string;
  confidence: number;
  color: string;
}

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [auraColor, setAuraColor] = useState<string>("rgba(255, 255, 255, 0)");

  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post<AnalysisResult>(
        "http://127.0.0.1:8000/analyze",
        { text }
      );
      setResult(res.data);
      setAuraColor(res.data.color);
    } catch {
      alert("Could not connect to the backend 😢");
    } finally {
      setLoading(false);
    }
  };

  const auroraLetters = "AURORA".split("");

  return (
    <div className="app-wrapper relative flex items-center justify-center h-screen w-screen overflow-hidden">
     

      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-center space-y-14">
        {/* Curved AuroraMind Title */}
        <div className="flex flex-col items-center select-none">
          {/* AURORA curved */}
          <div className="flex space-x-3 mb-[-40px]">
            {auroraLetters.map((char, i) => (
              <span
                key={i}
                className="text-[200px] font-extrabold shimmer-text"
                style={{
                  display: "inline-block",
                  transform: `rotate(${(i - auroraLetters.length / 2) * 12}deg) translateY(-40px)`,
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* MIND flat */}
          <div className="text-[140px] font-extrabold shimmer-text tracking-widest">
            MIND
          </div>
        </div>

        {/* Input area */}
        <div className="flex w-[780px] h-20 bg-[#f8f4ed]/85 rounded-full backdrop-blur-md shadow-[inset_0_2px_6px_rgba(255,255,255,0.6),0_8px_14px_rgba(0,0,0,0.1)] border border-[#e4dacb]/70 transition-all duration-500">
          <textarea
            className="flex-grow px-8 py-4 text-[#4b3b2e] text-xl bg-transparent resize-none focus:outline-none placeholder-[#9c8e7f]"
            placeholder="Type something to reveal your aura..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
          />
          <button
            onClick={analyzeText}
            disabled={loading}
            className="px-10 bg-[#efe3cf] hover:bg-[#f3e8d6] text-[#3b2e20] font-semibold rounded-r-full text-xl transition-all duration-300"
          >
            {loading ? "..." : "Analyze"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-16 animate-fadeIn text-[#3b2f25] relative">
            <h2 className="text-6xl font-bold capitalize">{result.emotion}</h2>
            <p className="text-gray-800 mt-3 text-2xl">
              Confidence: {Math.round(result.confidence * 100)}%
            </p>
          </div>
        )}

         {/* Aurora shimmer background */}
      <div className="absolute inset-0 aurora-bg"></div>

      {/* Aura sphere */}
      <div
        className="absolute rounded-full blur-3xl opacity-80 transition-all duration-1000"
        style={{
          width: "550px",
          height: "550px",
          background: auraColor,
          filter: "blur(100px) brightness(1.2)",
          zIndex: 1,
        }}
      ></div>
      </div>
    </div>
  );
}

export default App;
