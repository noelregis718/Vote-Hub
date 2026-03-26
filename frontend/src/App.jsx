import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatePoll from './pages/CreatePoll'
import Landing from './pages/Landing'
import AuthSuccess from './pages/AuthSuccess'
import EAuction from './pages/EAuction'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

function AppContent() {
  const { user, logout } = useAuth()

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-poll" element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        } />
        <Route path="/eauction" element={
          <ProtectedRoute>
            <EAuction />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
