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
        <div className="flex items-center justify-between w-[880px] h-[90px] bg-[#fdfaf6]/95 rounded-[2.5rem] backdrop-blur-md border border-[#e4dacb]/70 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-8 transition-all duration-500">
          <input
            type="text"
            className="flex-grow bg-transparent border-none outline-none text-[#4b3b2e] text-lg placeholder-[#b4a697] px-4 leading-relaxed"
            placeholder="🌷 Write something heartfelt and let AuroraMind feel your vibe..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 250))}
          />

          <button
          onClick={analyzeText}
          disabled={loading}
          className={`
            flex items-center justify-center px-10 py-3 text-base font-semibold
            rounded-full border-2 transition-all duration-300
            ${loading
              ? "border-[#9c8e7f]/40 text-[#9c8e7f]/40 cursor-not-allowed"
              : "border-[#3b2e20]/60 text-[#3b2e20] hover:border-[#8b7355] hover:text-[#8b7355] hover:bg-[#f8f4ed]/40"
            }
          `}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#3b2e20]/60 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Analyze"
          )}
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
