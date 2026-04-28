import { syncOfflineClips } from "./api";
import { toast } from "sonner";

const DB_NAME = "OnlineClipboardOffline";
const DB_VERSION = 1;
const STORE_NAME = "pending_clips";

let db;

async function initDB() {
  if (db) return db;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Queue a clip (Plaintext)
 */
export async function queueClip(content, username, visible , fileName = null) {
  await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const pendingClip = {
    content,
    username,
    visible,
    timestamp: new Date().toISOString(),
    fileName
  };

  return new Promise((resolve, reject) => {
    const request = store.add(pendingClip);
    request.onsuccess = () => {
      toast.info("Offline: Clip saved locally.", {
        description: "Will sync when online.",
      });
      resolve();
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function syncPendingClips() {
  if (!navigator.onLine) return;

  await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const allPending = await new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });

  if (allPending.length === 0) return;

  try {
    // Map items to match backend ClipDto fields exactly
    const payload = allPending.map(({ content, username, visible, fileName }) => ({
      content,
      username,
      visible, 
      fileName
    }));

    const result = await syncOfflineClips(payload);
    
    if (result.status === "SYNC_COMPLETE") {
      if (result.settled > 0) {
        const clearTx = db.transaction(STORE_NAME, "readwrite");
        clearTx.objectStore(STORE_NAME).clear();
        toast.success(`Synced ${result.settled} clips!`);
      } else {
        console.warn("Sync attempted but 0 clips were settled. Keeping local data.");
      }
    }
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

window.addEventListener("online", syncPendingClips);
syncPendingClips();
