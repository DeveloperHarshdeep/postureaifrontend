# PostureAI – Real-Time Rule-Based Posture Detection App

A full-stack web application built for Realfy's technical assignment that detects bad posture in real time using rule-based logic. Users can analyze posture using webcam or uploaded videos in **squat** or **desk** mode.

The app uses **TensorFlow MoveNet** on the frontend for pose estimation and **rule-based analysis** on the backend to provide instant posture feedback.

---

## 🌐 Live Demo

- **Frontend (Vercel):** [https://postureai.vercel.app](https://postureai.vercel.app)
- **Backend (Render):** [https://postureai.onrender.com](https://postureai.onrender.com)
- **Demo Video:** [INSERT_YOUR_DEMO_VIDEO_LINK_HERE]

---

## 📁 GitHub Repositories

- **Frontend Repo:** [https://github.com/DeveloperHarshdeep/postureaifrontend](https://github.com/DeveloperHarshdeep/postureaifrontend)
- **Backend Repo:** [https://github.com/DeveloperHarshdeep/postureAi](https://github.com/DeveloperHarshdeep/postureAi)

---

## 🧠 Posture Rules

### Squat Mode:
- ❌ Flagged if **knee goes beyond toe**
- ❌ Flagged if **back angle < 150°**

### Desk Mode:
- ❌ Flagged if **neck bend > 30°**
- ❌ Flagged if **back not straight**

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- TensorFlow MoveNet
- Socket.IO (WebSocket client)
- Recharts (posture score visualization)
- Canvas overlay with pose skeleton

### Backend
- Node.js
- Express
- Socket.IO (WebSocket server)
- Custom posture rule logic (pure JS)

---

## 🖥️ Local Setup Instructions

### 🔷 Frontend Setup

```bash
# Clone the frontend repository
git clone https://github.com/DeveloperHarshdeep/postureaifrontend.git
cd postureaifrontend

# Install dependencies
npm install

# Add environment variable
echo "VITE_BACKEND_URL=http://localhost:5000" > .env

# Run development server
npm run dev
```
---
### 🔷 Backend Setup
```
# Clone the backend repository
git clone https://github.com/DeveloperHarshdeep/postureAi.git
cd postureAi

# Install dependencies
npm install

# Run the server
node server.js
```

### 📁 Folder Structure
## Frontend
```
src/
├── components/
│   ├── FeedBackOverlay.jsx
│   ├── WebcamFeed.jsx
│   ├── VideoUpload.jsx
│   ├── Header.jsx
├── pages/
│   └── Home.jsx
├── sockets/
│   └──socket.js
├── App.jsx
└── main.jsx
```
## Backend
```
/
├── controllers/
│   └── postureController.js
├── routes/
│   └── index.js
├── services/
│   └── postureRules.js
├── sockets/
│   └── socketHandler.js
├── utils/
│   └── keypointUtils.js
├── server.js
└── package.json

```
