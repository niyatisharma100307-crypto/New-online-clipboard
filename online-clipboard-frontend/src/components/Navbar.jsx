import { Link, useNavigate } from "react-router-dom";
import { Terminal, LogOut, LayoutDashboard, UserCircle, Wifi } from "lucide-react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="border-b border-[#141416] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-[#111] border border-[#222] p-2 rounded-lg group-hover:border-blue-500/50 transition-colors">
            <Terminal className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight leading-none">
              Online Clipboard
            </span>
            <span className="text-[10px] text-gray-500 font-mono group-hover:text-blue-400 transition-colors">
              v2.0.0 // stable
            </span>
          </div>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Dashboard Link */}
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Link>

              {/* User Profile / Status */}
              <div className="flex items-center gap-4 pl-6 border-l border-[#141416]">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm  text-white leading-none">
                      {user.username}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Disconnect Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login"
              className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              <UserCircle className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}