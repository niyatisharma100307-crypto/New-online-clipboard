import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authUser } from "../services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, Lock, User as UserIcon, Loader2 } from "lucide-react";

export default function Auth({ setUser }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await authUser(formData.username, formData.password);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user)); 
      
      toast.success(`Welcome back, ${user.username}!`);
      
      // REDIRECT FIX: Go to Home instead of Dashboard
      navigate("/"); 

    } catch (err) {
      toast.error("Invalid credentials or username taken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Access Cloud</h2>
          <p className="text-slate-500 mt-2 text-sm">Login or Signup to sync your history</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                required
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}