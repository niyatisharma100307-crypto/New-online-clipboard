import { useEffect, useState } from "react";
import { getUserClips } from "../services/api";
import { Copy, Terminal, Search } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard({ user }) {
  const [clips, setClips] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.username) {
      getUserClips(user.username)
        .then((data) => {
          setClips(data.reverse()); 
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const filteredClips = clips.filter(
    (clip) =>
      clip.content.toLowerCase().includes(filter.toLowerCase()) ||
      clip.code.includes(filter)
  );

  return (
    <div className="px-20 mx-auto py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-gray-400" /> 
            Clip History
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and retrieve your synced content.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            // FIXED: border-[#141416]
            className="w-full bg-[#0A0A0A] border border-[#141416] text-gray-300 pl-9 pr-4 py-2 rounded text-sm focus:ring-1 focus:ring-gray-600 outline-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* FIXED: border-[#141416] */}
      <div className="border border-[#141416] rounded-lg overflow-hidden bg-[#0A0A0A] shadow-sm">
        
        {/* FIXED: border-[#141416] */}
        <div className="grid grid-cols-12 border-b border-[#141416] bg-[#111] py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-2">Code</div>
          <div className="col-span-9">Content Preview</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-500 text-sm font-mono animate-pulse">
            Loading streams...
          </div>
        )}

        {!loading && filteredClips.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm">No clips found matching your criteria.</p>
          </div>
        )}

        <div className="divide-y divide-gray-800/50">
          {filteredClips.map((clip) => (
            <div 
              key={clip.code} 
              className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#161616] transition-colors group text-sm font-mono"
            >
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-white font-bold">
                  #{clip.code}
                </span>
              </div>
              <div className="col-span-9 pr-8">
                <p className="text-gray-300 truncate opacity-80 group-hover:opacity-100 transition-opacity">
                  {clip.content}
                </p>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => copyToClipboard(clip.content)}
                  className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded hover:bg-gray-800"
                  title="Copy Content"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 font-mono">
        <span>Total Clips: {filteredClips.length}</span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Sync
        </span>
      </div>
    </div>
  );
}