import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import NewPost from './pages/NewPost';
import Login from "./pages/Login";
import { getAuthToken } from "./api";

function App() {
  const isAuthenticated = !!getAuthToken();

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
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
