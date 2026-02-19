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
- **Safe sandbox**: Interactive AI does not use real LLMs—everything is pre‑loaded to keep the experience fast, safe, and controllable offline.

---

## 🧱 Tech Stack

- **Frontend**: HTML5, CSS3, React (Typescript)
- **Virtual AI engine**: A lightweight simulation layer (no external API calls) to mimic AI responses and models
- **Hosting**: Deployed via **Netlify** for fast, scalable hosting

---

## 🔐 Firebase Google Login + 2FA Setup

Yes — you need Firebase web app config values (including `VITE_FIREBASE_API_KEY`) for this login flow.

> Note: Firebase Web API keys are **not secret credentials**. They identify your Firebase project in client apps. Security comes from Firebase Auth rules, authorized domains, and MFA—not from hiding this key.

This repo now includes the MiniAI Firebase project values as defaults in the app, so it can run without extra setup.

If you want to override them (recommended for your own Firebase project), create a `.env` file in the project root and map your Firebase console values like this:
- `apiKey` → `VITE_FIREBASE_API_KEY`
- `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
- `projectId` → `VITE_FIREBASE_PROJECT_ID`
- `appId` → `VITE_FIREBASE_APP_ID`
- `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`

`storageBucket` and `measurementId` are optional for this auth-only integration.

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
```

In Firebase Console:
- Enable **Authentication → Sign-in method → Google**.
- Enable **Multi-factor authentication** and allow **SMS** as a second factor.
- Add your local/dev domain to authorized domains.
- Since you host on Netlify, add **miniai-learn.netlify.app** to Firebase Authentication → Settings → Authorized domains.
