import React from 'react'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const navigate=useNavigate()
  return (
    <div className="container text-center">
        <table className='table table-sm'>
            <thead><tr>
                <th><button className='btn btn-primary btn-lg' onClick={()=>navigate("/searchbykitta")}>जग्गा प्रतिवेदन</button></th>
                <th><button className='btn btn-primary btn-lg' onClick={()=>navigate("/searchbyowner")}>व्यक्ती प्रतिवेदन</button></th>
            </tr>
            <tr>
                <th><button className='btn btn-primary btn-lg' onClick={()=>navigate("/admin")}>एडमिन प्यानल</button></th>
                <th><button className='btn btn-primary btn-lg' onClick={()=>navigate("/logout")}>बाहिर जानुहोस्</button></th>
            </tr>            
            </thead>
        </table>
    </div>
  )
}

export default Dashboard
