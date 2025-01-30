import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import NewPost from './pages/NewPost';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="new-post" element={<NewPost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;