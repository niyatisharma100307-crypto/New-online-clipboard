import { Link, useNavigate } from "react-router-dom";
import { ClipboardCopy, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Animated Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200"
            >
              <ClipboardCopy className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Clip<span className="text-blue-600">Sync</span>
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <Link 
                  to="/dashboard" 
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <div className="h-4 w-px bg-slate-200"></div>

                <div className="flex items-center gap-3 bg-slate-100/50 pl-1 pr-3 py-1 rounded-full border border-slate-200">
                  <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.username[0]}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                    {user.username}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors font-semibold text-sm shadow-xl shadow-slate-200"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Get Started
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}