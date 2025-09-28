import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as  Router,Routes,Route } from 'react-router-dom';
import Search from './search/Search';
import Admin from './Admin/Admin';
import Login from './Login/Login';
function App() { 
  return (
    <Router>
    <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
    </Router>
  )
}

export default App
