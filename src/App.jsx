import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as  Router,Routes,Route } from 'react-router-dom';
import Admin from './Admin/Admin';
import Login from './Login/Login';
import SearchByKitta from './Search/SearchByKitta';
import SearchByOwner from './Search/SearchByOwner';
import Dashboard from './Dashboard/Dashboard';
import Logout from './Logout/Logout';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
function App() { 
  return (
    <Router>
    <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
           {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route
        path="/searchbykitta"
        element={<ProtectedRoute element={<SearchByKitta />} />}
      />
      <Route
        path="/searchbyowner"
        element={<ProtectedRoute element={<SearchByOwner />} />}
      />
      <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
      <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />
        </Routes>
    </Router>
  )
}

export default App
