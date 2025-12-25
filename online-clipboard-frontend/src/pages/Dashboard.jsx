import { useEffect, useState } from "react";
import { getUserClips } from "../services/api";
import { Copy, Clock } from "lucide-react";

export default function Dashboard({ user }) {
  const [clips, setClips] = useState([]);

  useEffect(() => {
    if (user?.username) {
      getUserClips(user.username).then(setClips);
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" /> Your History
      </h2>

      {clips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-lg">You haven't saved any clips yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <div key={clip.code} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group relative">
              <div className="absolute top-4 right-4 bg-gray-100 px-2 py-1 rounded text-xs font-mono font-bold text-gray-600">
                #{clip.code}
              </div>
              <p className="text-gray-800 line-clamp-4 font-mono text-sm mb-4 min-h-[4rem]">
                {clip.content}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(clip.content);
                  alert("Copied!");
                }}
                className="w-full flex items-center justify-center gap-2 text-blue-600 bg-blue-50 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition"
              >
                <Copy className="w-4 h-4" /> Copy Content
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}