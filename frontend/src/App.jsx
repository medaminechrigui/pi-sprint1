import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/auth/SignIn';
import CatererSignUp from './pages/auth/CatererSignUp';
import UserSignUp from './pages/auth/UserSignUp';
import Profile from './pages/Profile';
import Home from './pages/Home';
import RecetteForm from './components/RecetteForm';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recette/add" element={<RecetteForm />} />
        <Route path="/recette/edit/:id" element={<RecetteForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup/caterer" element={<CatererSignUp />} />
        <Route path="/signup/user" element={<UserSignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
