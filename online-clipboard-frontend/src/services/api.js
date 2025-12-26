const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";


export const wakeUpServer = async () => {
  try {
    await fetch(`${API_URL}/health-check`); 
    console.log("Server poked to wake up!");
  } catch (err) {
    console.log(err);
  }
};


export const createClip = async (content, username = null) => {
  const payload = { content, username };
  const response = await fetch(`${API_URL}/clips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create clip");
  return response.json();
};

export const getClipByCode = async (code) => {
  const response = await fetch(`${API_URL}/clips/${code}`);
  if (!response.ok) throw new Error("Clip not found");
  return response.json();
};

export const getUserClips = async (username) => {
  const response = await fetch(`${API_URL}/clips/user/${username}`);
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
};

export const authUser = async (username, password) => {
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  });
  if (!response.ok) throw new Error("Failed to delete clip");
  return response.json();
};

export const updateClip = async (id, content) => {
  const response = await fetch(`${API_URL}/clips/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Failed to update clip");
  return response.json();
};