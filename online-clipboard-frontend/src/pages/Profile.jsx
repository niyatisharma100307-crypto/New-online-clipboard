import { useEffect, useState } from "react";
import { updatePassword, updateUsername } from "../services/api";
import { toast } from "sonner";
import { User, Lock, Save, Loader2, ShieldCheck, Mail, Pencil } from "lucide-react";

export default function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);

  useEffect(() => {
    setUsername(user?.username || "");
  }, [user?.username]);

  const handleUsernameSave = async (e) => {
    e.preventDefault();
    const nextUsername = username.trim();

    if (!nextUsername) {
      toast.error("Username cannot be empty.");
      return;
    }

    if (nextUsername === user?.username) {
      toast.info("Username already matches the current value.");
      return;
    }

    setSavingUsername(true);
    try {
      const updatedUser = await updateUsername(nextUsername);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Username updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update username");
    } finally {
      setSavingUsername(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(user.username, formData.oldPassword, formData.newPassword);
      toast.success("Password updated successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 font-sans">
      
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#222] bg-[#111] flex items-center justify-center shrink-0">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user?.username || "Profile"} className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-gray-500" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-6 h-6 text-gray-400" />
            User Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account security and display name.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0A0A0A] border border-[#141416] rounded-lg shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-[#111] border-b border-[#141416] p-4 flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-green-500" />
           <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Security Settings</span>
        </div>

        <div className="p-6 md:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2 block">
                Email
              </label>
              <div className="bg-[#161616] border border-[#222] text-gray-300 p-3 rounded flex items-center gap-3 opacity-80">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-mono break-all">{user?.email || "No email available"}</span>
              </div>
            </div>

            <form onSubmit={handleUsernameSave}>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2 block">
                Username
              </label>
              <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded p-2 focus-within:border-blue-500/50 transition-colors">
                <Pencil className="w-4 h-4 text-gray-500 ml-1" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-none text-white w-full p-1 text-sm focus:outline-none placeholder-gray-700"
                  placeholder="Choose a username"
                />
                <button
                  type="submit"
                  disabled={savingUsername}
                  className="bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-white text-white px-4 py-2 rounded text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {savingUsername ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>

          <hr className="border-[#222] mb-6" />

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2 block">
                Current Password
              </label>
              <div className="flex items-center bg-[#111] border border-[#222] rounded focus-within:border-blue-500/50 transition-colors">
                <div className="pl-3 text-gray-500"><Lock className="w-4 h-4" /></div>
                <input 
                  type="password" 
                  required
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                  className="bg-transparent border-none text-white w-full p-3 text-sm focus:outline-none placeholder-gray-700"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2 block">
                  New Password
                </label>
                <input 
                  type="password" 
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="bg-[#111] border border-[#222] rounded text-white w-full p-3 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-700 transition-colors"
                  placeholder="New password"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2 block">
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="bg-[#111] border border-[#222] rounded text-white w-full p-3 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-700 transition-colors"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-white text-white py-3 rounded text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Password
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}