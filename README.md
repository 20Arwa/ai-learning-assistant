# Ai learning assistant

A full-stack AI-powered learning application that allows users to upload documents, explore their content, and interact with them using AI. Users can chat with their documents, generate summaries, flashcards, quizzes, and get concept explanations in a smart and interactive way.

Note: The UI design is based on a YouTube tutorial [**Build a Full-Stack AI-Powered Learning Assistant App**](https://youtu.be/iaAdWmAu0TE?si=6K5bPzhlFyn12CTG), with custom improvements and additional features implemented for learning and development purposes.

---

## 🌐 Live Demo

👉 https://ai-learning-assistant-4jdaen9hq-arwas-projects-d21dd2bc.vercel.app/dashboard

**Note:** AI-powered features are disabled in the live demo because the required API key is not deployed publicly. You can run the project locally with your own API keys to access the full functionality.

---

## ✨ Features

* Upload and manage documents
* AI-powered document chat (ask questions about your files)
* Generate smart summaries of documents
* Create flashcards from document content
* Generate quizzes for self-assessment
* Explain specific concepts from documents using AI
* JWT-based authentication and authorization (Register & Login)
* User-specific document management
* Responsive and modern UI

---

## App Preview

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Document Page

![Document Page](screenshots/document.png)


---

## 🛠️ Tech Stack

### Frontend

* Next.js 
* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Flowbite

### Backend

* Node.js
* Express.js
* MongoDB
* JSON Web Token (JWT)

---


## 🚀 Getting Started (Run Locally)

### 1. Clone the repository

```bash
git clone https://github.com/20Arwa/ai-learning-assistant.git
cd ai-learning-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create the following environment files:

### 🔹 Server (`/server/.env`)

```env
MONGODB_URL=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 🔹 Client (`/client/.env.local`)

```env
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Open in browser
http://localhost:3000


