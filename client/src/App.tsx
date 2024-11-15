
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/user/LoginPage';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import ProtectedRoute from './components/user/ProtectedRoute';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/signin' element={<LoginPage />}/>
        <Route path='/signup' element={<LoginPage />}/>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
