import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; 

export default function TerminalLoader({ message = "Processing..." }) {
  const [logs, setLogs] = useState(["Initializing system..."]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
   
    const messages = [
      "Preparing your files...",
      "Securing connection...",
      "Encrypting data...",
      "Connecting to server...",
      "Uploading content...",
      "Verifying upload...",
      "Finalizing...",
      "Cleaning up...",
    ];

    let i = 0;
    const logInterval = setInterval(() => {
      if (i < messages.length) {
        setLogs((prev) => [...prev.slice(-4), messages[i]]); 
        i++;
      }
    }, 400);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  return (
  
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center font-sans p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
      
        <div className="bg-[#1a1a1a] border-b border-gray-800 p-3 flex items-center justify-between px-4">
          <span className="text-xs font-medium text-gray-400">System Status</span>
          <div className="flex gap-1.5 opacity-50">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>

        <div className="p-6 flex flex-col justify-end">
          
       
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
            
               <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
               <span className="text-white font-bold">{message}</span>
            </div>
            <span className="text-blue-400 font-mono text-sm font-bold">
              {Math.min(progress, 100)}%
            </span>
          </div>

       
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "linear", duration: 0.3 }}
            />
          </div>

       
          <div className="space-y-1 h-20 flex flex-col justify-end overflow-hidden text-xs text-gray-500 font-mono border-t border-gray-800/50 pt-3">
            {logs.map((log, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="truncate"
              >
                {log}
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  );
}