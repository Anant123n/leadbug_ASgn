# Leadbug WhatsApp CRM Simulation

A full-stack WhatsApp CRM simulation platform built with **React, Node.js, Express, and MongoDB**. This project simplifies WhatsApp Business workflows, including onboarding, template management, sequence building, and contact management—without requiring external API keys.

## 🚀 Features

- **WhatsApp Onboarding Wizard:** 4-step interactive flow with mock OTP and Meta verification simulation.
- **Template Management:** Create, list, and delete message templates with a **Live Preview** and dynamic variables (e.g., `{{name}}`).
- **Sequence Builder:** 4-step wizard to create marketing sequences, select recipients, and schedule messages.
- **Contact Hub:** Manage business contacts with filtering and manual addition options.
- **Responsive UI:** Modern, premium design based on Leadbug aesthetics.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Axios, CSS (Glassmorphism & Leadbug Design System).
- **Backend:** Node.js, Express, Mongoose (MongoDB).
- **Database:** MongoDB Atlas.

---

## 💻 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   MONGO_URL=your_mongodb_atlas_connection_string
   PORT=5005
   ```
   > [!NOTE]
   > We use port **5005** to avoid conflicts with macOS system services (AirPlay/Control Center) which typically occupy port 5000.
4. Start the server:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5005/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## 🏠 Project Structure

```text
leadbug_ASgn/
├── backend/
│   ├── controllers/      # Route logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── DbConfig/         # Database connection
│   └── server.js         # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # Shared UI components
    │   ├── pages/        # Main feature pages
    │   ├── utils/        # API and helper functions
    │   └── App.jsx       # Routing 
    └── index.html
```

---

## ⚠️ Important Notes

- **CORS:** The backend is configured to allow requests from any frontend origin (`cors()`).
- **Scheduling:** Message sequences are simulated using `setTimeout` on the backend. In a real-world scenario, you would use a tool like Redis/BullMQ or a Cron job.
- **Port:** If you change the backend port, ensure you update both `.env` files accordingly.

---

## 🐛 Author
Leadbug Software Developer Assignment
Duration: April 2026
