# PWA Twitter-like app 🕊️

A simple Twitter-like Progressive Web App (PWA) built with **React (Vite) + TypeScript** on the frontend and **Express + Sequelize + MySQL** on the backend.

---

## 🚀 Install the project

### **1️⃣ Backend Setup**
1. Navigate to the backend folder:
   ```
   cd back
   npm i
   ```
2. **Configure the Environment**:
   - Create a copy of `.env.dist` and rename it to `.env`.
   - Edit `.env` to match your local database settings (e.g., `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

3. **Import the Database**:
   - Open **PHPMyAdmin** or any MySQL tool.
   - Create a new database called `pwa_twitter_app` *(or the value in `DB_NAME` in your `.env` file)*.
   - **Import the pre-configured database** from `/db/db.sql`.

4. **Start the Backend**:
   ```sh
   npm run dev
   ```

---

### **2️⃣ Frontend Setup**
1. Navigate to the frontend folder:
   ```sh
   cd ../front
   npm i
   ```
2. **Start the Frontend**:
   ```sh
   npm run dev
   ```
3. Open the app in your browser: [http://localhost:5173/](http://localhost:5173/)

---

🎉 **Now your project is ready to go! 🚀**

