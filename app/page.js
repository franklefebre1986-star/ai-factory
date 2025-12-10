"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint =
        mode === "image"
          ? "/api/generate-image"
          : "/api/generate-video";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
      } else {
        setResult(data.result);
      }
    } catch (e) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-4 border p-6 rounded-xl bg-gray-900">
        <h1 className="text-2xl font-bold">AI Generator</h1>

        <div className="flex gap-2">
          <button
            className={`flex-1 p-2 rounded ${
              mode === "image" ? "bg-white text-black" : "bg-gray-700"
            }`}
            onClick={() => setMode("image")}
          >
            🖼 Image
          </button>

          <button
            className={`flex-1 p-2 rounded ${
              mode === "video" ? "bg-white text-black" : "bg-gray-700"
            }`}
            onClick={() => setMode("video")}
          >
            🎬 Video
          </button>
        </div>

        <textarea
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          rows={3}
          placeholder="Describe your image or video..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="w-full p-2 rounded bg-blue-600 disabled:opacity-50"
          disabled={loading || !prompt}
          onClick={generate}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {error && <p className="text-red-400">{error}</p>}

        {result && (
          <div className="mt-4">
            {mode === "image" ? (
              <img
                src={result}
                alt="result"
                className="w-full rounded"
              />
            ) : (
              <video
                src={result}
                controls
                className="w-full rounded"
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

