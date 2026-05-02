import { useEffect, useState } from "react";
// Import the new function here
import { getPublicClips, getPublicUserClips } from "../services/api"; 
import { Globe, Clock, Copy, Search, Terminal, FileText, Download, User, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function Community() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [activeSearch, setActiveSearch] = useState(""); 
  

  const [page, setPage] = useState(0);
  const [viewingClip, setViewingClip] = useState(null); 
  const pageSize = 10;

  useEffect(() => {
    loadCommunity();
  }, [page, activeSearch]);

  const loadCommunity = async () => {
    setLoading(true);
    try {
      let data;
      
      if (activeSearch.trim()) {
        // CASE A: Search by Username
        data = await getPublicUserClips(activeSearch, page, pageSize);
      } else {

        data = await getPublicClips(page, pageSize);
      }
      
      setClips(data);
    } catch (err) {
      setClips([]);
      if (activeSearch) toast.error("User not found or no public clips.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0); 
    setActiveSearch(searchTerm); 
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
    setPage(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };


  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); toast.success("Copied to clipboard!"); };
  const isBase64File = (content) => {
    return content && content.startsWith("FILE_URL:");
  };

const downloadFile = async (content, code = "file") => {
    let url = content.replace("FILE_URL:", "");
    let ext = "";
    
    // 1. Extract the extension we saved in the backend
    if (url.includes("|")) {
        const parts = url.split("|");
        ext = parts[0]; // e.g., ".pdf"
        url = parts[1]; // e.g., "https://res.cloudinary..."
    }

    const loadingToast = toast.loading("Downloading file...");

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // Fallback for older files uploaded before this fix
      if (!ext) {
          const mimeType = blob.type.toLowerCase();
          if (mimeType.includes("zip") || mimeType.includes("compressed")) ext = ".zip";
          else if (mimeType.includes("pdf")) ext = ".pdf";
          else if (mimeType.includes("png")) ext = ".png";
          else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
      }

      // 2. Force an invisible background download with the perfect filename
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = `clip-${code}${ext}`; // Creates "clip-12345.pdf"
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      toast.success("Download complete!", { id: loadingToast });

    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Opening in new tab...", { id: loadingToast });
      window.open(url, "_blank");
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // Most servers send UTC but don't specify it. 
    // We append 'Z' if missing to ensure it's parsed as UTC.
    let dateToParse = dateString;
    if (typeof dateString === 'string' && !dateString.includes('Z') && !dateString.includes('+')) {
      dateToParse = dateString.replace(' ', 'T') + 'Z';
    }

    return new Date(dateToParse).toLocaleString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata' 
    });
  };

  return (
    <div className="px-4 md:px-20 mx-auto py-8 md:py-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-gray-400" /> Community Feed
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeSearch ? `Showing results for user: ${activeSearch}` : "Discover snippets shared by other developers."}
          </p>
        </div>

     
        <div className="relative w-full md:w-80 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#0A0A0A] border border-[#141416] text-gray-300 pl-9 pr-8 py-2 rounded text-sm focus:ring-1 focus:ring-blue-900/50 outline-none placeholder-gray-600"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="absolute right-2 top-2.5 text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={handleSearch}
            className="bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-white px-4 py-2 rounded text-sm font-bold transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-[#141416] rounded-md overflow-hidden bg-[#0A0A0A] shadow-sm mb-6">
        <div className="hidden md:grid grid-cols-12 border-b border-[#141416] bg-[#111] py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-2">User</div>
          <div className="col-span-1">Code</div>
          <div className="col-span-6">Content</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {loading && (
          <div className="divide-y divide-gray-800/50 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="hidden md:grid grid-cols-12 items-center py-4 px-4 gap-4">
                {/* User */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E1E1E] shrink-0" />
                  <div className="h-3 w-20 bg-[#1E1E1E] rounded" />
                </div>
                {/* Code */}
                <div className="col-span-1">
                  <div className="h-3 w-10 bg-[#1E1E1E] rounded" />
                </div>
                {/* Content */}
                <div className="col-span-6 pr-4 flex flex-col gap-2">
                  <div className="h-3 bg-[#1E1E1E] rounded w-3/4" />
                  <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
                </div>
                {/* Created */}
                <div className="col-span-2">
                  <div className="h-3 w-20 bg-[#1E1E1E] rounded" />
                </div>
                {/* Action */}
                <div className="col-span-1 flex justify-end">
                  <div className="h-7 w-7 bg-[#1E1E1E] rounded" />
                </div>
              </div>
            ))}
            {/* Mobile skeletons */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`m-${i}`} className="flex md:hidden flex-col gap-3 py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E1E1E] shrink-0" />
                  <div className="h-3 w-24 bg-[#1E1E1E] rounded" />
                </div>
                <div className="h-3 bg-[#1E1E1E] rounded w-full" />
                <div className="h-3 bg-[#1A1A1A] rounded w-2/3" />
                <div className="flex justify-between pt-2 border-t border-[#141416]">
                  <div className="flex gap-2">
                    <div className="h-3 w-12 bg-[#1E1E1E] rounded" />
                    <div className="h-3 w-20 bg-[#1A1A1A] rounded" />
                  </div>
                  <div className="h-7 w-7 bg-[#1E1E1E] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && clips.length === 0 && (
          <div className="p-12 text-center border-t border-[#141416]">
            <Terminal className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {activeSearch ? `No public clips found for "${activeSearch}"` : "No public clips found."}
            </p>
            {activeSearch && (
              <button onClick={clearSearch} className="mt-4 text-blue-500 hover:underline text-xs">
                Back to Global Feed
              </button>
            )}
          </div>
        )}

        {!loading && (
        <motion.div
          className="divide-y divide-gray-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {clips.map((clip) => (
            <div key={clip.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-0 md:items-center py-4 px-4 hover:bg-[#161616] transition-colors group text-sm font-mono items-start md:items-center">
              <div className="md:col-span-2 flex items-center w-full md:w-auto">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/20 shrink-0"><User className="w-3 h-3 text-blue-400" /></div>
                  <span className="text-gray-300 truncate font-bold text-base md:text-xs">{clip.username || "Anonymous"}</span>
                </div>
              </div>
              <div className="hidden md:block md:col-span-1"><span className="text-blue-500 font-bold">#{clip.code}</span></div>
              <div className="md:col-span-6 pr-0 md:pr-4">
                {isBase64File(clip.content) ? (
                  <div className="flex items-center gap-2 text-purple-400"><FileText className="w-4 h-4 shrink-0" /><span className="italic truncate">{clip.fileName || "File"}</span></div>
                ) : (
                  <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                    {clip.content.length > 60 ? `${clip.content.substring(0, 60)}...` : clip.content}
                  </p>
                )}
              </div>
              <div className="hidden md:flex md:col-span-2 items-center gap-2 text-xs text-gray-600"><Clock className="w-3 h-3" />{formatDate(clip.createdAt)}</div>
              {/* Mobile-only: code + timestamp — sits just above the action icons */}
              <div className="flex md:hidden items-center gap-3 order-last md:order-none border-t border-[#141416] pt-3 w-full">
                <span className="text-blue-500 font-bold text-xs">#{clip.code}</span>
                <div className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" />{formatDate(clip.createdAt)}</div>
              </div>
              <div className="md:col-span-1 flex justify-start md:justify-end flex-wrap gap-2 order-last md:order-none pt-3 md:pt-0 border-t border-[#141416] md:border-t-0 w-full md:w-auto">
                {!isBase64File(clip.content) && (
                  <button 
                    onClick={() => setViewingClip(clip)} 
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                {isBase64File(clip.content) ? (
                    <button onClick={() => downloadFile(clip.content, clip.code)} className="p-2 text-purple-500 hover:bg-purple-500/10 rounded transition-colors"><Download className="w-4 h-4" /></button>
                ) : (
                    <button onClick={() => copyToClipboard(clip.content)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors"><Copy className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
        )}
      </div>


      <div className="flex items-center justify-between border-t border-[#141416] pt-4">
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0 || loading}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded hover:bg-[#1A1A1A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        
        <span className="text-xs font-mono text-gray-600">Page {page + 1}</span>
        
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={clips.length < pageSize || loading} 
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded hover:bg-[#1A1A1A] transition-colors"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/* View Modal */}
      <AnimatePresence>
        {viewingClip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingClip(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#141416] rounded-lg shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#141416]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold">{viewingClip.username || "Anonymous"}</h2>
                    <p className="text-blue-500 text-xs font-mono font-bold">#{viewingClip.code}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingClip(null)}
                  className="p-2 text-gray-500 hover:text-white hover:bg-[#1A1A1A] rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto mb-6 bg-[#050505] rounded-md p-4 border border-[#111]">
                <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap break-words">
                  {viewingClip.content}
                </pre>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setViewingClip(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-white font-bold transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => { copyToClipboard(viewingClip.content); setViewingClip(null); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}