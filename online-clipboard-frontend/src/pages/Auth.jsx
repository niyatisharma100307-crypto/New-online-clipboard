import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUser } from "../services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, UserCircle } from "lucide-react";

export default function Auth({ setUser }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;
    
    setLoading(true);
    
    try {
      const user = await authUser(formData.username, formData.password);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); 
      
      toast.success("Login successful!");
      navigate("/"); 

    } catch (err) {
      toast.error("Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0A0A0A] border border-[#141416] rounded-lg shadow-2xl overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-[#111] border-b border-[#141416] p-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <UserCircle className="w-3 h-3" />
              Secure Login
            </div>
            <div className="w-12"></div>
          </div>

          <div className="p-8">
            
            {/* Friendly Welcome Message */}
            <div className="mb-8 space-y-1 text-sm text-center">
              <h2 className="text-xl text-white font-bold">Welcome Back</h2>
              <p className="text-gray-500">Sign in to access your history.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Username */}
              <div className={`transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-50' : 'opacity-100'}`}>
                <label className="text-xs text-blue-500 font-bold mb-1 block uppercase tracking-wide">
                  Username
                </label>
                <div className={`flex items-center bg-[#111] border ${focusedField === 'username' ? 'border-blue-500/50' : 'border-[#141416]'} p-3 rounded transition-colors`}>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={formData.username}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-transparent border-none outline-none text-gray-200 w-full placeholder-gray-700 text-sm"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`transition-opacity duration-300 ${focusedField === 'username' ? 'opacity-50' : 'opacity-100'}`}>
                <label className="text-xs text-purple-500 font-bold mb-1 block uppercase tracking-wide">
                  Password
                </label>
                <div className={`flex items-center bg-[#111] border ${focusedField === 'password' ? 'border-purple-500/50' : 'border-[#141416]'} p-3 rounded transition-colors`}>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-transparent border-none outline-none text-gray-200 w-full placeholder-gray-700 text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-white text-white py-3 rounded text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 mt-6 group"
              >
                {loading ? (
                  <> <Loader2 className="w-4 h-4 animate-spin" /> Signing In... </>
                ) : (
                  <> Sign In <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" /> </>
                )}
              </motion.button>

            </form>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-6">
          New here? Just sign in and we'll create an account for you.
        </p>

      </motion.div>
    </div>
  );
}