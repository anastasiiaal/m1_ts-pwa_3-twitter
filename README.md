# PWA Twitter-like app 🕊️

A simple Twitter-like Progressive Web App (PWA) built with **React (Vite) + TypeScript** on the frontend and **Express + Sequelize + MySQL** on the backend.

---

## 🚀 Install the project

### **1️⃣ Backend Setup**
1. Navigate to the backend folder:
   ```sh
   cd back
   npm i
   ```
2. **Configure the Environment**:
   - Create a copy of `.env.dist` and rename it to `.env`.
   - Edit `.env` to match your local database settings (e.g., `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

3. **Create the database**:
   - Open **PHPMyAdmin** or any MySQL tool.
   - Create a new database called `pwa_twitter_app` *(or the value in `DB_NAME` in your `.env` file)*.
   - **Uncomment** the `alter: true` line in `/back/src/utils/sequelize.js` to allow Sequelize to create the tables:
   ```js
    await sequelize.sync({
      alter: true,
    })
   ```

4. **Start the Backend**:
   ```sh
   npm run dev
   ```

5. **Register your user via Postman**:
    - Go to POST route `http://localhost:8081/api/auth/register`
    - Add your user via body, e.g.:
    ```
    {
        "pseudo": "Toto",
        "email": "toto@gmail.com",
        "password": "12345"
    }
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
3. **Open the app in your browser**: [http://localhost:5173/](http://localhost:5173/)

4. **Create an account** and start posting !

---

### **3️⃣ Test Setup**
1. In your frontend folder, stop the dev server and launch the build, then the preview mode :

```
npm run build
npm run preview
```

2. Open the app in your browser: http://localhost:4173/
---

 **Now your project is ready to go! 🚀**

---

### Features : 
- ✔️ Création de compte
- ✔️ Connexion
- ✔️ Liste des posts
- ✔️ Ajout d'un post
- ✔️ Liste des posts d'une personne précise
- ✔️ Utilisation du précache pour fonctionnement hors ligne
- ✔️ Utilisation d'un cache "network-first" pour avoir les derniers posts chargés, même hors-ligne
- ✔️ Ajout d'un post en mode hors-ligne (offline-sync)
- ✔️ Abonnements & Notifications "général" (je m'abonne, dès que quelqu'un ajoute un post, j'ai une notif)
- ✔️ Ouverture du site lors du click sur une notif  

### Features "en plus" : 
- Mise à jour en temps réel de la liste des posts (via le système de notifications puhs)
- Passer les notifs en mode "follow". (Je m'abonne à des profils en particulier, je reçois une notif si l'un d'eux ajoute un post)
- ✔️ Affichage d'une info-bulle si on est hors-ligne
- Ajout de photo sur les posts
- Pouvoir prendre des photos directement via l'appli
- Ajout de géolocalisation sur les posts
- Pouvoir utiliser son micro pour écrire un post (speech-to-text)
- Faire le post par une IA (text-to-speech)
- Ajout de filtre type instagram sur l'appareil photo in-app.
- Tout autre idée.  