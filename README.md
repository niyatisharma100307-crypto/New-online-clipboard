# 🌐 Online Clipboard with Intelligent Offline Sync

A premium, modern web application designed for seamless text and file sharing across devices. This project features a robust **Offline-First** architecture that ensures your productivity is never interrupted by network instability.

![Frontend Showcase](https://img.shields.io/badge/Frontend-React%20+%20Vite-blue)
![Backend Showcase](https://img.shields.io/badge/Backend-Spring%20Boot%203-green)
![Database Showcase](https://img.shields.io/badge/Database-PostgreSQL%20+%20Redis-red)

---

## 🚀 Key Features

### 1. ⚡ Instant Sharing
*   **Text Clips**: Paste any text and get a unique 5-digit code for instant retrieval on any other device.
*   **File Uploads**: Support for single files and multiple files (automatically zipped into a `.zip` archive).
*   **Public/Private Visibility**: Choose whether to make your clips discoverable in the "Community" tab or keep them private to your account.

### 2. 📶 Intelligent Offline Sync (New!)
The application is designed to handle "dead zones" gracefully:
*   **Zero Data Loss**: If your network drops while saving or uploading, the app automatically stores your content in a local **IndexedDB** queue.
*   **Background Sync**: Using the browser's `online` event listeners, the app detects when connectivity is restored and silently syncs all pending clips to the server.
*   **Toast Notifications**: Real-time feedback via `sonner` informs you when items are queued offline and when they are successfully settled.

### 3. 🛡️ Enterprise-Grade Security
*   **At-Rest Encryption**: All clipboard content is encrypted on the server using **AES/ECB/PKCS5Padding** before being stored in the database.
*   **Authenticated Access**: Private clips are protected by a secure authentication layer, accessible only via your dashboard.
*   **Idempotency**: The sync engine is designed to be idempotent, preventing duplicate clips if a sync process is interrupted or retried.

### 4. 🎨 Premium UI/UX
*   **Cyberpunk Terminal Aesthetic**: A sleek, dark-mode interface with glassmorphism and smooth micro-animations using `framer-motion`.
*   **Real-time Status**: A dynamic status widget monitors backend health and informs you if the server is waking up from sleep.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS (Vanilla CSS components), Framer Motion, Lucide Icons, Sonner |
| **Backend** | Java 21, Spring Boot 4.0.1, Spring Data JPA, Spring Cache (Redis) |
| **Storage** | PostgreSQL (Persistent), Redis (Cache/Idempotency), IndexedDB (Browser Local) |
| **Cryptography** | JCE (Java Cryptography Extension) - AES-128 |

---

## 📦 Getting Started

### 1. Prerequisites
*   Node.js 18+
*   Java 21 (JDK)
*   PostgreSQL & Redis

### 2. Backend Setup
```bash
cd online-clipboard-backend
# Update application.properties with your DB credentials
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd online-clipboard-frontend
npm install
npm run dev
```

---

## 📸 How Offline Sync Works
1.  **Save while Offline**: The app detects a `TypeError` or `fetch` failure.
2.  **Local Storage**: Content is mapped to a JSON skeleton and stored in the browser's `OnlineClipboardOffline` IndexedDB.
3.  **The "Online" Trigger**: Once `navigator.onLine` returns true, the `syncPendingClips` service kicks in.
4.  **Auto-Settlement**: The server processes the bulk request, creates the clips, and returns a 5-digit code for each.

---

## 📄 License
This project is for educational and simulation purposes. Feel free to fork and enhance!

