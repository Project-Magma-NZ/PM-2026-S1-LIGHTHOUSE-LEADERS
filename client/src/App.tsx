import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Survey from './pages/Survey'
// import Login from './pages/Login'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Completed from './pages/Completed'
import CreateSurvey from './pages/CreateSurvey'
import './index.css'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login'

  return (
    <div className="appShell">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<ProtectedRoute><Navigate to="/login" replace /></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute><Survey /></ProtectedRoute>} />
        <Route path="/survey/:surveyId" element={<ProtectedRoute><Survey /></ProtectedRoute>} />
        <Route path="/create-survey" element={<ProtectedRoute><CreateSurvey /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/analytics' element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path='/completed' element={<ProtectedRoute><Completed /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App