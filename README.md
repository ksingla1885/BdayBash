# 🎉 BdayBash: The Personalized Birthday Surprise Generator

BdayBash is a full-stack web application designed to create unforgettable, emotional, and high-energy birthday surprises. Users can generate a unique magic link that, when opened, reveals a beautiful animated experience tailored to the birthday star.

![BdayBash Banner](https://images.unsplash.com/photo-1464347744102-11db6282f854?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Features

### 🛠️ Core Experience
- **Personalized Wish Creation**: A sleek form to capture receiver/sender details.
- **Tone Selector**: Choose between **Heartfelt (Emotional)**, **Humorous (Funny)**, or **Brutally Savage** vibes.
- **AI-Powered Messages**: Tap into "AI Magic" to generate the perfect message based on your selected tone.
- **Cloudinary Integration**: High-speed image and audio uploads for seamless media delivery.
- **Unique Shareable Links**: Each wish gets a short, unique slug (e.g., `/wish/xyz123`).

### 🔥 The "WOW" Birthday Page
- **"Open Your Surprise" Intro**: A mysterious gift-box entry screen that builds anticipation.
- **Confetti Explosion**: A cinematic burst of confetti upon opening the gift.
- **Typing Animation**: Real-time typing effect for the birthday message to make it feel personal.
- **Instagram-Style Memory Timeline**: Multiple images auto-advance with progress bars and tap-to-navigate functionality.
- **Atmospheric Music**: Optional background music that autoplays (after user interaction) with mute controls.

## 🏗️ Tech Stack

### Frontend
- **React (Vite)**: Lightning-fast rendering and development.
- **Tailwind CSS (v4)**: Modern, utility-first styling for a premium UI.
- **Framer Motion**: Industry-standard animations for smooth transitions.
- **Canvas-Confetti**: High-performance particle animations.

### Backend
- **Node.js & Express**: Robust and scalable API architecture.
- **MongoDB & Mongoose**: Flexible document storage for wishes.
- **Multer & Cloudinary**: automated media management and CDN delivery.
- **OpenAI/Groq API**: Intelligence for dynamic message generation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account
- OpenAI or Groq API key

### 1. Project Setup
```bash
git clone <your-repo-url>
cd BdayBash
```

### 2. Backend Configuration
Navigate to `backend/` and create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key # Optional fallback
CLIENT_URL=http://localhost:5173
```
Run the server:
```bash
npm install
npm run dev
```

### 3. Frontend Configuration
Navigate to `frontend/` and create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Run the app:
```bash
npm install
npm run dev
```

## 📂 Project Structure

```
BdayBash/
├── backend/
│   ├── src/
│   │   ├── config/       # DB & Cloudinary configs
│   │   ├── controllers/  # API logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routes
│   │   └── server.js     # Entry point
│   └── vercel.json       # Deployment config
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI (Confetti, Slider, etc.)
    │   ├── pages/        # Main views (Create, Surprise, Share)
    │   ├── App.jsx       # Routing
    │   └── index.css     # Tailind & Global styles
    └── vercel.json       # Deployment config
```

## 🎨 Design Philosophy
BdayBash uses a **Glassmorphic Dark Theme** with vibrant gradients (Pink ↔ Indigo) to create a premium, high-end feel. The focus is on **Micro-interactions**—every button click and transition is animated to keep the user engaged.

---
Made with ❤️ by ketan
