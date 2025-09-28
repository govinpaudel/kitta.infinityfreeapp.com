import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate= useNavigate()
  return (
    <div>
      <h1>login login</h1>
      <button onClick={()=>navigate("search")}>search</button>    
    </div>
  )
}

export default Login
