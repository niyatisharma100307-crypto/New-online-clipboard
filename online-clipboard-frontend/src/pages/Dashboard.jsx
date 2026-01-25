import { useEffect, useState } from "react";
import { getUserClips, deleteClip, updateClip } from "../services/api";
import { Copy, Terminal, Search, Trash2, Edit2, Save, X, Loader2, Clock, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard({ user }) {
  const [clips, setClips] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setLoading(true);
      // Pass page and pageSize to API
      getUserClips(user.username, page, pageSize)
        .then((data) => {
          // Note: Backend might return oldest first. 
          // If you want consistent sorting on the current page:
          setClips(data.sort((a, b) => b.id - a.id)); 
        })
        .catch(() => toast.error("Failed to load clips"))
        .finally(() => setLoading(false));
    }
  }, [user, page]); // Re-run when page changes

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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
    link.download = `clip-${filenameCode}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this clip?")) return;
    const previousClips = [...clips];
    setClips(clips.filter(c => c.id !== id));
    try {
      await deleteClip(id);
      toast.success("Clip deleted");
      // Optional: Refresh page to fill the gap
      // getUserClips(user.username, page, pageSize).then(setClips);
    } catch (err) {
      setClips(previousClips);
      toast.error("Failed to delete");
    }
  };

  const startEdit = (clip) => {
    if (isBase64File(clip.content)) {
      toast.error("Cannot edit binary files directly.");
      return;
    }
    setEditingId(clip.id);
    setEditContent(clip.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = async (id) => {
    if (!editContent.trim()) return;
    setActionLoading(true);
    try {
      await updateClip(id, editContent);
      setClips(clips.map(c => c.id === id ? { ...c, content: editContent } : c));
      setEditingId(null);
      toast.success("Clip updated");
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredClips = clips.filter(
    (clip) =>
      clip.content.toLowerCase().includes(filter.toLowerCase()) ||
      clip.code.includes(filter)
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="px-4 md:px-20 mx-auto py-8 md:py-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-gray-400" /> 
            Clip History
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your synced content.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Filter current page..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#141416] text-gray-300 pl-9 pr-4 py-2 rounded text-sm focus:ring-1 focus:ring-gray-600 outline-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-[#141416] rounded-md overflow-hidden bg-[#0A0A0A] shadow-sm mb-6">
        <div className="grid grid-cols-12 border-b border-[#141416] bg-[#111] py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3 md:col-span-2">Code</div>
          <div className="col-span-6 md:col-span-6">Content</div>
          <div className="hidden md:block md:col-span-2">Created</div>
          <div className="col-span-3 md:col-span-2 text-right">Actions</div>
        </div>

        {loading && <div className="p-8 text-center text-gray-500 text-sm font-mono animate-pulse">Loading streams...</div>}
        {!loading && filteredClips.length === 0 && <div className="p-12 text-center"><p className="text-gray-500 text-sm">No clips found on this page.</p></div>}

        <div className="divide-y divide-gray-800/50">
          {filteredClips.map((clip) => (
            <div key={clip.id} className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#161616] transition-colors group text-sm font-mono">
              {/* Code */}
              <div className="col-span-3 md:col-span-2 flex items-center gap-2"><span className="text-white font-bold">#{clip.code}</span></div>
              {/* Content */}
              <div className="col-span-6 md:col-span-6 pr-4">
                {editingId === clip.id ? (
                  <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} autoFocus className="w-full bg-[#111] border border-blue-500/50 text-white px-2 py-1 rounded outline-none" onKeyDown={(e) => { if(e.key === 'Enter') saveEdit(clip.id); if(e.key === 'Escape') cancelEdit(); }} />
                ) : (
                  isBase64File(clip.content) ? (
                    <div className="flex items-center gap-2 text-blue-400"><FileText className="w-4 h-4 shrink-0" /><span className="italic truncate">File</span></div>
                  ) : (
                    <p className="text-gray-300 truncate opacity-80 group-hover:opacity-100 transition-opacity">{clip.content}</p>
                  )
                )}
              </div>
              {/* Created */}
              <div className="hidden md:flex md:col-span-2 items-center gap-2 text-xs text-gray-500"><Clock className="w-3 h-3" />{formatDate(clip.createdAt)}</div>
              {/* Actions */}
              <div className="col-span-3 md:col-span-2 flex justify-end gap-1 md:gap-2">
                {editingId === clip.id ? (
                  <>
                    <button onClick={() => saveEdit(clip.id)} disabled={actionLoading} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded">{actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}</button>
                    <button onClick={cancelEdit} disabled={actionLoading} className="p-1.5 text-gray-500 hover:bg-gray-800 rounded"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <div className="flex gap-1">
                    {isBase64File(clip.content) ? (
                        <button onClick={() => downloadFile(clip.content, `clip-${clip.code}`)} className="p-1.5 text-purple-500 hover:text-white hover:bg-purple-500/20 rounded"><Download className="w-4 h-4" /></button>
                    ) : (
                        <button onClick={() => copyToClipboard(clip.content)} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded"><Copy className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => startEdit(clip)} className="p-1.5 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(clip.id)} className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
}