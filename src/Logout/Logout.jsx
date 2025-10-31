import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Logout = () => {
    const navigate=useNavigate()
    useEffect(() => {
      sessionStorage.removeItem('user');
      navigate("/login");
      toast.success("सफलतापुर्वक लगआउट भयो ।")
    }, [])
    
  return (
    <div>
      Logout
    </div>
  )
}

export default Logout
