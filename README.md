# 📘 MiniAI‑Learn 

**MiniAI‑Learn** is a web-based educational game that introduces kids (ages 6–12) to fundamental AI concepts through fun, interactive challenges and bite‑sized lessons.

Live demo: **[miniai-learn.netlify.app](https://miniai-learn.netlify.app)**

---

## 🎯 Purpose

MiniAI‑Learn helps young learners explore artificial intelligence in an enjoyable, gamified environment. Through a journey of mini-games, projects, and prompts, kids build core AI intuition like prompt crafting, logic thinking, and basic ML principles.

---

## 🚀 Features

- **Adventure‑style gameplay**: Earn badges, unlock levels, and collect ‘AI Tokens’ by completing quests.
- **Interactive lessons**: Learn about pattern recognition, creative prompts, and problem-solving with hands-on activities.
- **Prompt challenges**: Kids enter various prompts and see how the AI responds—prompt iteration promotes experimentation.
- **Visual progress tracker**: Friendly characters and progress bars show milestones and learning achievements.
- **AI chatbot helper**: The app can now connect to the Gemini API for live chatbot responses, with a local fallback when no API key is configured.

## 🔑 Gemini Setup

1. Create a `.env` file in the project root.
2. Copy the values from `.env.example`.
3. Set `GEMINI_API_KEY` to your Gemini API key.
4. Leave `DATABASE_URL` empty for local SQLite, or set it to a Postgres connection string if you want local Postgres.
5. Start the backend with `npm run server`.
6. Start the frontend with `npm run dev`.

Gemini requests now go through the backend so the API key stays off the client.

## 🌐 Deployment

Recommended setup:

- Frontend: Netlify
- Backend API: Render

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-service.onrender.com/api`

### Render

- Service type: Web Service
- Build command: `npm install`
- Start command: `npm run server`
- Environment variables:
  - `DATABASE_URL`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL=gemini-2.5-flash`

The repo includes [netlify.toml](/Users/vedantkansara/FinalMiniAI/MiniAIWebApp/MiniAIWebApp/netlify.toml) and [render.yaml](/Users/vedantkansara/FinalMiniAI/MiniAIWebApp/MiniAIWebApp/render.yaml) to help bootstrap deployment.

## 🗄️ Database Note

This project now prefers Postgres when `DATABASE_URL` is set and falls back to SQLite at `server/data/miniai.db` for local development. On Render, use the managed Postgres database from `render.yaml` so user progress and auth data persist safely across deploys.

---

## 🧱 Tech Stack

- **Frontend**: HTML5, CSS3, React (Typescript)
- **AI engine**: Gemini Generate Content API with a local fallback helper
- **Hosting**: Deployed via **Netlify** for fast, scalable hosting
