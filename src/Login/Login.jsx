import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Actions/Action'
import { toast } from 'react-toastify';
import LoadingOverlay from '../Loading/LoadingOverlay';
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    const data = { username: username, password: password };
    const res = await loginUser(data);
    console.log(res);
    if (res.data.status == true) {
      sessionStorage.setItem('user', JSON.stringify(res.data.data));
      console.log("User saved:", res.data.data);
      toast.success(res.data.message);
      navigate("/dashboard");
    }
    else{
      toast.warning(res.data.message);
    }
    setLoading(false);
  }
  return (
    
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <div className="col-md-4 text-center border rounded p-4 shadow">
        <h5 className="mb-4">लगईन गर्नुहोस्</h5>
        <div className="mb-3">
          <input type="text" onChange={(e) => {
            setUsername(e.target.value)
          }} value={username} name="username" className="form-control text-center" placeholder="Username" required />
        </div>
        <div className="mb-3">
          <input type="password" onChange={(e) => {
            setPassword(e.target.value)
          }} value={password} name="password" className="form-control text-center" placeholder="Password" required />
        </div>
        <button onClick={handleLogin} className="btn btn-primary w-100">लगईन गर्नुहोस्</button>
      </div>
    </div>

  )
}

export default Login
