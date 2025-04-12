import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chatbot from './components/Chatbot'; // Import the Chatbot component
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          {/* Add the chatbot as a floating component on every page */}
          <div className="fixed bottom-4 right-4">
            <Chatbot />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
