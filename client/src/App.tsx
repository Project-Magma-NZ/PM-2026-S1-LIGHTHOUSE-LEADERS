import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Survey from './pages/Survey'
// import Login from './pages/Login'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Completed from './pages/Completed'
import './index.css'
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="appShell">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute><Survey /></ProtectedRoute>} />
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
