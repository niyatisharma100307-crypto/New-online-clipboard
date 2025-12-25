import { useState, useEffect } from "react";
import { getClips, createClip } from "../services/api";

export default function Clipboard() {
  const [clips, setClips] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load clips on mount
  useEffect(() => {
    loadClips();
  }, []);

  const loadClips = async () => {
    try {
      const data = await getClips();
      // Sort by newest first (assuming ID increments)
      setClips(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Error loading clips:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const newClip = await createClip(input);
      setClips([newClip, ...clips]); // Add new clip to top of list
      setInput("");
    } catch (err) {
      alert("Failed to save clip");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Input Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">New Clip</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text here..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300 transition"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        {clips.map((clip) => (
          <div key={clip.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition">
            <p className="text-gray-700 truncate w-3/4 font-mono text-sm">{clip.content}</p>
            <button
              onClick={() => copyToClipboard(clip.content)}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Copy
            </button>
          </div>
        ))}
        {clips.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No clips found. Add one above!</p>
        )}
      </div>
    </div>
  );
}