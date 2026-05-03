import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

let authToken = localStorage.getItem("clerk_token") || null;
export const setAuthToken = (token) => {
  authToken = token;
  if (token) localStorage.setItem("clerk_token", token);
  else localStorage.removeItem("clerk_token");
};

export const clerkUpsert = async (profileData = {}) => {
  const response = await fetch(`${API_URL}/user/clerk`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error("Failed to upsert clerk user");
  return response.json();
};

export const updateUsername = async (username) => {
  const response = await fetch(`${API_URL}/user/username`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update username");
  }
  return response.json();
};

const getHeaders = (hasJson = true) => {
  const headers = {};
  if (hasJson) headers["Content-Type"] = "application/json";
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  return headers;
};

export const wakeUpServer = async () => {
  try {
    const response = await fetch(`${API_URL}/health-check`); 
    if (response.ok) {
        console.log("Server poked to wake up!");
        return true;
    }
  } catch (err) {
    console.log("Server might be sleeping or error:", err);
   
    throw err; 
  }
};
export const createClip = async (content, username = null , visible = false , fileName = null) => {
  const payload = { content, username, visible, fileName };
  const response = await fetch(`${API_URL}/clips`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create clip");
  return response.json();
};


export const getPublicClips = async (page = 0, size = 10) => {
  const response = await fetch(`${API_URL}/clips/public?page=${page}&size=${size}`, { headers: getHeaders(false) });

  if (response.status === 429) {
    const errorData = await response.json();
    toast.error(errorData.message); 
    throw new Error("Rate limit exceeded"); 
  }


  if (!response.ok) throw new Error("Failed to load community clips");
  return response.json();
};

export const getClipByCode = async (code) => {
  const response = await fetch(`${API_URL}/clips/${code}`, { headers: getHeaders(false) });
  if (!response.ok) throw new Error("Clip not found");
  return response.json();
};


export const getUserClips = async (username, page = 0, size = 10) => {
  const response = await fetch(`${API_URL}/clips/user/${username}?page=${page}&size=${size}`, { headers: getHeaders(false) });
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
};

export const authUser = async (username, password) => {
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error("Invalid credentials or username taken");
  }
  return response.json();
};

export const deleteClip = async (id) => {
  const response = await fetch(`${API_URL}/clips/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });
  if (!response.ok) throw new Error("Failed to delete clip");
  return response.json();
};

export const updateClip = async (id, content) => {
  const response = await fetch(`${API_URL}/clips/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Failed to update clip");
  return response.json();
};


export const updatePassword = async (username, oldPassword, newPassword) => {
  const response = await fetch(`${API_URL}/user/updatePassword`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update password. Check your old password.");
  }
  return response.json();
};

export const getPublicUserClips = async (username, page = 0, size = 10) => {
  const response = await fetch(`${API_URL}/clips/public/${username}?page=${page}&size=${size}`, { headers: getHeaders(false) });
  if (!response.ok) {
    // If user not found or error, throw specific error
    throw new Error("User not found or no public clips");
  }
  return response.json();
};

export const syncOfflineClips = async (clips) => {
  const response = await fetch(`${API_URL}/clips/sync`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(clips),
  });
  if (!response.ok) throw new Error("Sync failed");
  return response.json();
};