import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import NewPost from './pages/NewPost';
import Login from "./pages/Login";
import UserFeed from './pages/UserFeed';
import { getAuthToken } from "./api";

function App() {
  const isAuthenticated = !!getAuthToken();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log("📩 Received message from service worker:", event.data);

      if (event.data.action === "refreshPage") {
        console.log("🔄 Refreshing the page...");
        window.location.reload(); // force the page to reload
      }

      if (event.data.action === "redirectToHome") {
        window.location.href = "/"; // redirect to homepage
      }
    });
  }

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="new-post" element={<NewPost />} />
            <Route path="/login" element={<Navigate to="/" />} /> {/* Prevents logged-in users from seeing login page */}
            <Route path="/feed/:id" element={<UserFeed />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
