import { useEffect, useState } from "react";
import { getUserClips, deleteClip, updateClip } from "../services/api";
import { Copy, Terminal, Search, Trash2, Edit2, Save, X, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard({ user }) {
  const [clips, setClips] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // --- EDITING STATE ---
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      getUserClips(user.username)
        .then((data) => {
          setClips(data.sort((a, b) => b.id - a.id)); 
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this clip?")) return;
    const previousClips = [...clips];
    setClips(clips.filter(c => c.id !== id));
    try {
      await deleteClip(id);
      toast.success("Clip deleted");
    } catch (err) {
      setClips(previousClips);
      toast.error("Failed to delete");
    }
  };

  const startEdit = (clip) => {
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

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="px-4 md:px-20 mx-auto py-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-gray-400" /> 
            Clip History
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your synced content.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#141416] text-gray-300 pl-9 pr-4 py-2 rounded text-sm focus:ring-1 focus:ring-gray-600 outline-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-[#141416] rounded-md overflow-hidden bg-[#0A0A0A] shadow-sm">
        
        {/* Table Header - Added "Created" Column */}
        <div className="grid grid-cols-12 border-b border-[#141416] bg-[#111] py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-2">Code</div>
          <div className="col-span-6">Content Preview</div>
          <div className="col-span-2">Created</div> {/* NEW COLUMN HEADER */}
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-8 text-center text-gray-500 text-sm font-mono animate-pulse">
            Loading streams...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredClips.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm">No clips found matching your criteria.</p>
          </div>
        )}

        {/* List */}
        <div className="divide-y divide-gray-800/50">
          {filteredClips.map((clip) => (
            <div 
              key={clip.id} 
              className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#161616] transition-colors group text-sm font-mono"
            >
              
              {/* CODE */}
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-white font-bold">
                  #{clip.code}
                </span>
              </div>

              {/* CONTENT */}
              <div className="col-span-6 pr-4">
                {editingId === clip.id ? (
                  <input 
                    type="text" 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                    className="w-full bg-[#111] border border-blue-500/50 text-white px-2 py-1 rounded outline-none"
                    onKeyDown={(e) => {
                      if(e.key === 'Enter') saveEdit(clip.id);
                      if(e.key === 'Escape') cancelEdit();
                    }}
                  />
                ) : (
                  <p className="text-gray-300 truncate opacity-80 group-hover:opacity-100 transition-opacity">
                    {clip.content}
                  </p>
                )}
              </div>

              {/* NEW: CREATED AT COLUMN */}
              <div className="col-span-2 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(clip.createdAt)}
              </div>

              {/* ACTIONS */}
              <div className="col-span-2 flex justify-end gap-2">
                {editingId === clip.id ? (
                  <>
                    <button onClick={() => saveEdit(clip.id)} disabled={actionLoading} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded">
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                    <button onClick={cancelEdit} disabled={actionLoading} className="p-1.5 text-gray-500 hover:bg-gray-800 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyToClipboard(clip.content)}
                      className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEdit(clip)}
                      className="p-1.5 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(clip.id)}
                      className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 font-mono">
        <span>Total Clips: {filteredClips.length}</span>
      </div>
    </div>
  );
}