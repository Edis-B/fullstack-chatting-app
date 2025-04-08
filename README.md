
# 📦 Fullstack React + Node.js + MongoDB App

This is a fullstack web application built with:

- 💻 **Frontend**: React + Vite + Tailwind CSS  
- 🖥️ **Backend**: Node.js + Express  
- 🗃️ **Database**: MongoDB  

---

## 🚀 Getting Started (Production Mode)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/)
- A MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Configure MongoDB**

   Open the file:

   ```txt
   server/src/index.js
   ```

   Replace the default connection string with your own:

   ```js
   mongoose.connect("YOUR_MONGODB_CONNECTION_STRING_HERE");
   ```

3. **Open Two Terminals**

   You'll need one terminal for the frontend and one for the backend.

4. **Set Up and Run the Frontend (Terminal 1)**

   ```bash
   cd client
   npm install
   npm run build
   npm run preview
   ```

5. **Set Up and Run the Backend (Terminal 2)**

   ```bash
   cd server
   npm install
   npm run prod
   ```

6. **Application URLs**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Development Mode (Optional)

7. **Frontend Dev Server**

   ```bash
   cd client
   npm run dev
   ```

8. **Backend Dev Server**

   ```bash
   cd server
   npm run dev
   ```

---
