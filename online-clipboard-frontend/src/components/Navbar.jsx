import { Link, useNavigate } from "react-router-dom";
import { Terminal, LogOut, LayoutDashboard, UserCircle, Globe, Settings, User2 } from "lucide-react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="border-b border-[#141416] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-40 font-sans">
      {/* Responsive Padding: px-4 on mobile */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
           <span className="text-lg font-sans text-white leading-none">
              Online Clipboard
            </span>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            to="/community"
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Community</span>
          </Link>
          
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
               <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                <User2 className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* User Profile / Status */}
              <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-[#141416]">
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors bg-[#1A1A1A] hover:bg-[#222] border border-[#333] px-3 py-1.5 rounded-full"
            >
              <UserCircle className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}