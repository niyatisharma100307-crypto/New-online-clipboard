import { useEffect, useState } from "react";
import { getPublicClips } from "../services/api";
import { Globe, Clock, Copy, Search, Terminal, FileText, Download, User } from "lucide-react";
import { toast } from "sonner";

export default function Community() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadCommunity();
  }, []);

  const loadCommunity = async () => {
    try {
      const data = await getPublicClips();
      setClips(data);
    } catch (err) {
      toast.error("Could not load community feed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const isBase64File = (content) => {
    return content && content.startsWith("data:");
  };

  const downloadFile = (content, filenameCode) => {
    const link = document.createElement("a");
    link.href = content;
    
    let extension = "bin";
    if (content.startsWith("data:image/")) extension = "png";
    if (content.startsWith("data:application/pdf")) extension = "pdf";
    if (content.startsWith("data:application/zip") || content.includes(";base64,UEsDB")) extension = "zip";
    
    link.download = `community-clip-${filenameCode}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const filteredClips = clips.filter(c => 
    c.content.toLowerCase().includes(filter.toLowerCase()) || 
    (c.username && c.username.toLowerCase().includes(filter.toLowerCase())) ||
    c.code.includes(filter)
  );

  return (
    <div className="px-4 md:px-20 mx-auto py-12 font-sans">
      
      {/* Header - Matches Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-500" /> 
            Community Feed
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Discover snippets shared by other developers.
          </p>
        </div>

        {/* Search Bar - Matches Dashboard */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search feed..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#141416] text-gray-300 pl-9 pr-4 py-2 rounded text-sm focus:ring-1 focus:ring-blue-900/50 outline-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* Table Container - Matches Dashboard */}
      <div className="border border-[#141416] rounded-md overflow-hidden bg-[#0A0A0A] shadow-sm">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 border-b border-[#141416] bg-[#111] py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-2 md:col-span-2">User</div>
          <div className="col-span-2 md:col-span-1">Code</div>
          <div className="col-span-6 md:col-span-6">Content</div>
          <div className="col-span-2 md:col-span-2 hidden md:block">Created</div>
          <div className="col-span-2 md:col-span-1 text-right">Action</div>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-500 text-sm font-mono animate-pulse">
            Loading community feed...
          </div>
        )}

        {!loading && filteredClips.length === 0 && (
          <div className="p-12 text-center border-t border-[#141416]">
            <Terminal className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No public clips found.</p>
          </div>
        )}

        {/* Table Rows */}
        <div className="divide-y divide-gray-800/50">
          {filteredClips.map((clip) => (
            <div 
              key={clip.id} 
              className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#161616] transition-colors group text-sm font-mono"
            >
              
              {/* User Column */}
              <div className="col-span-2 md:col-span-2 flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/20 shrink-0">
                   <User className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-gray-300 truncate font-bold text-xs">
                  {clip.username || "Anonymous"}
                </span>
              </div>

              {/* Code Column */}
              <div className="col-span-2 md:col-span-1">
                <span className="text-blue-500 font-bold">
                  #{clip.code}
                </span>
              </div>

              {/* Content Column */}
              <div className="col-span-6 md:col-span-6 pr-4">
                {isBase64File(clip.content) ? (
                  <div className="flex items-center gap-2 text-purple-400">
                    <FileText className="w-4 h-4" />
                    <span className="italic">Binary File</span>
                  </div>
                ) : (
                  <p className="text-gray-400 truncate group-hover:text-gray-200 transition-colors">
                    {clip.content}
                  </p>
                )}
              </div>

              {/* Created Column (Hidden on mobile) */}
              <div className="col-span-2 md:col-span-2 hidden md:flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {formatDate(clip.createdAt)}
              </div>

              {/* Actions Column */}
              <div className="col-span-2 md:col-span-1 flex justify-end">
                {isBase64File(clip.content) ? (
                    <button
                      onClick={() => downloadFile(clip.content, clip.code)}
                      className="p-2 text-purple-500 hover:bg-purple-500/10 rounded transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                      onClick={() => copyToClipboard(clip.content)}
                      className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 font-mono">
        <span>Public Clips: {filteredClips.length}</span>
      </div>
    </div>
  );
}