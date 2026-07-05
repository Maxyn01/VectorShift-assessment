# VectorShift Technical Assessment

A full-stack, node-based visual pipeline builder designed for the VectorShift Frontend Engineering assessment. This application allows users to drag-and-drop functional nodes onto a canvas, connect them into a pipeline, and validate the logic using a directed acyclic graph (DAG) algorithm on the backend.

## ✨ Key Features

- **Dynamic Node Abstraction:** Implemented a scalable `BaseNode` architecture to drastically reduce boilerplate code, making it trivial to introduce 5 new custom nodes (Math, Transform, Filter, Display, API) alongside the original ones.
- **Dynamic Handle Generation (Regex Parsing):** The Text Node leverages real-time regex parsing to dynamically generate new target handles whenever a variable (e.g., `{{variable_name}}`) is typed. It also securely cleans up orphaned edges when variables are deleted.
- **DAG Cycle Detection:** The FastAPI backend utilizes Kahn's Algorithm to validate the pipeline. If a user connects nodes in an infinite loop (a cycle), the backend rejects it and the UI triggers a clear warning.
- **Premium UI/UX:** Features a sleek dark mode with glassmorphism effects, a custom CSS dropdown menu, and a buttery-smooth auto-layout (Tidy Graph) feature powered by Dagre. 
- **Robust State Management:** Powered by Zustand for lightweight state management, including a full Undo/Redo history stack and seamless keyboard shortcuts (Ctrl+Z, Delete).

---

## 🛠️ Tech Stack

**Frontend:**
- React (Create React App)
- React Flow (Node-based UI)
- Zustand (State Management)
- Dagre (Auto-Layout engine)
- React Hot Toast (Notifications)
- Lucide React (Icons)

**Backend:**
- Python 3
- FastAPI
- Uvicorn

---

## 🚀 Run Instructions

### 1. Start the Backend

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

Install the dependencies:
```bash
pip install fastapi uvicorn
```

Start the Uvicorn server:
```bash
uvicorn main:app --reload
```
*The backend will run on `http://localhost:8000`*

### 2. Start the Frontend

Open a second terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install the Node dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```
*The frontend will open automatically at `http://localhost:3000`*

---

## 💡 Architecture Decisions

- **Why Zustand over Context API?** Zustand was chosen to prevent unnecessary re-renders across the canvas when dragging nodes, and to easily implement the Undo/Redo stack outside of the React component tree.
- **Why native CSS variables?** To easily support future light/dark mode toggling, all colors are abstracted into CSS variables at the `:root` level. This avoided the overhead of installing a heavy CSS-in-JS library for a 2-hour assessment.
