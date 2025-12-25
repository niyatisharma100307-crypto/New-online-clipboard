import { useState } from "react";
import { Copy, ArrowRight, Search, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; 
import { createClip, getClipByCode } from "../services/api";

export default function Home({ user }) {
  const [uploadText, setUploadText] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [searchCode, setSearchCode] = useState("");
  const [retrievedClip, setRetrievedClip] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadText.trim()) return;
    setIsUploading(true);
    
    // Optimistic UI feeling
    const loadingToast = toast.loading("Generating your secure code...");

    try {
      const data = await createClip(uploadText, user?.username);
      setGeneratedCode(data.code);
      setUploadText("");
      toast.dismiss(loadingToast);
      toast.success("Clip created successfully!");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetrieve = async (e) => {
    e.preventDefault();
    if (searchCode.length < 5) {
      toast.warning("Code must be at least 5 characters");
      return;
    }

    const loadingToast = toast.loading("Searching for clip...");
    setRetrievedClip(null);
    
    try {
      const data = await getClipByCode(searchCode);
      setRetrievedClip(data);
      toast.dismiss(loadingToast);
      toast.success("Clip found!");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Invalid code or clip expired.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 pt-10">
      
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight"
        >
          Sync text across <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">dimensions.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto"
        >
          No login required. Just drop your text, get a code, and pick it up anywhere. 
          Secure, fast, and simple.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* LEFT CARD: UPLOAD */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-1 rounded-md shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200"
        >
          <div className="bg-slate-50/50 p-6 sm:p-8 rounded-md h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Drop a Clip</h2>
                <p className="text-slate-500 text-sm">Create a temporary secure link</p>
              </div>
            </div>
            
            <form onSubmit={handleUpload}>
              <textarea
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                className="w-full h-40 p-4 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none font-mono text-sm text-slate-700 shadow-sm"
                placeholder="Paste your content here..."
              ></textarea>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={!uploadText || isUploading}
                className="mt-4 w-full bg-slate-900 text-white py-3.5 rounded-md font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                   <span className="animate-pulse">Syncing...</span>
                ) : (
                  <>Generate Code <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {generatedCode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-green-50/50 border border-green-200 p-6 rounded-md text-center overflow-hidden"
                >
                  <p className="text-green-600 font-medium text-sm mb-2">ACCESS CODE</p>
                  <div 
                    onClick={() => copyToClipboard(generatedCode)}
                    className="text-5xl font-mono font-bold text-slate-800 tracking-widest cursor-pointer hover:scale-105 transition-transform"
                  >
                    {generatedCode}
                  </div>
                  <p className="text-xs text-green-700/60 mt-2">Click code to copy</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* RIGHT CARD: RETRIEVE */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-1 rounded-md shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200"
        >
          <div className="bg-slate-50/50 p-6 sm:p-8 rounded-md h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-md">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Retrieve Clip</h2>
                <p className="text-slate-500 text-sm">Enter code to access content</p>
              </div>
            </div>

            <form onSubmit={handleRetrieve} className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="flex-1 text-center text-2xl font-mono tracking-widest p-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 rounded-md font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Get
              </motion.button>
            </form>

            <AnimatePresence mode="wait">
              {retrievedClip && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-md p-5 border border-slate-200 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                      Result
                    </span>
                    <button 
                      onClick={() => copyToClipboard(retrievedClip.content)}
                      className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <p className="text-slate-800 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                    {retrievedClip.content}
                  </p>
                  {retrievedClip.username && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-[8px]">
                        {retrievedClip.username[0]}
                      </div>
                      Created by <span className="font-semibold text-slate-600">{retrievedClip.username}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}