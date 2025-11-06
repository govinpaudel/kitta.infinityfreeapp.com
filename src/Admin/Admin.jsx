import { useNavigate } from 'react-router-dom';
import { createMaster, getCookiebyUser, getGabisaList, getDataByGabisa, sendRecordsToServer } from '../Actions/Action';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import LoadingOverlay from '../Loading/LoadingOverlay';


const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ipaddress, setIpaddress] = useState("100.97.198.62");
  const [cookie, setCookie] = useState("");
  const [loading, setLoading] = useState(false);
  const [gabisa, setGabisa] = useState([]);
  const [data, setData] = useState([]);

  const handleLogin = async () => {
    if (!username || !password || !ipaddress) {
      toast.warning("कृपया प्रयोगकर्ता र पासवर्ड प्रविष्ट गर्नुहोस् ।");
      return;
    }
    try {
      setLoading(true);
      const response = await getCookiebyUser(username, password, ipaddress);
      if (response.data.status = true) {
        toast.success(response.data.message);
        sessionStorage.setItem('cookie', response.data.data)
        sessionStorage.setItem('ipaddress',ipaddress)
        setCookie(response.data.data);
      }
    } catch (err) {
      toast.error("डेटा ल्याउन असफल भयो");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadgabisa = async () => {
    if (!ipaddress) {
      toast.warning("कृपया Ip Address प्रविष्ट गर्नुहोस् ।");
      return;
    }
    setLoading(true);
    const res = await getGabisaList(ipaddress);
    const newData = res.data.data.map(item => ({
      ...item,
      3: 'N',
      4: 'N'
    }));
    setGabisa(newData);
    console.log(newData);
    setLoading(false);
  }
  const createmaster = async () => {
    setLoading(true);
    const res = await createMaster();
    if (res.data.status == true) {
      toast.success(res.data.message)
    }
    setLoading(false);
  }

  const updateToServer = async (a) => {
    setLoading(true);
    if (data.length == 0) {
      toast.warning('कुनै पनि डाटा छैन');
      return;
    }
    const res = await sendRecordsToServer(data);
    if (res.data.status == true) {
      toast.success(res.data.message)
      setGabisa(prevGabisa =>
        prevGabisa.map(row =>
          row[0] === a ? { ...row, 4: 'Y' } : row
        )
      );
      setData([]);
    }
    setLoading(false);
  }

  const getdata = async (gabisa_id) => {    
    setLoading(true);
    const cookie = sessionStorage.getItem('cookie');
    if (!cookie) {
      toast.warning('लगईन भएको छैन ।')
      return;
    }
    const data={
      gabisa_id:gabisa_id,
      cookie:cookie,
      ipaddress:ipaddress
    }
    const res = await getDataByGabisa(data);

    if (res.data.status == true) {
      setData(res.data.data);
      toast.success(`जम्मा ${res.data.data.length} डाटा प्राप्त भयो`);
      setGabisa(prevGabisa =>
        prevGabisa.map(row =>
          row[0] === gabisa_id ? { ...row, 3: 'Y' } : row
        )
      );
    }
    console.log(res);
    setLoading(false);
  }

  return (
    <div className="container mt-5 position-relative">
      {loading && <LoadingOverlay loading={loading} />}
      <button className='btn btn-primary' onClick={() => { navigate("/dashboard") }}>पछाडी जानुहोस् ।</button>
      {/* Dashboard Header */}
      <div className="row justify-content-center">
        <div className="col-md-12">
          {/* Form starts */}
          <div className="row mt-4">
            <div className="col-md-3 d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='username'
              />
            </div>
            <div className="col-md-3 d-flex">
              <input
                type="password"
                className="form-control me-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password'
              />
            </div>
            <div className="col-md-3 d-flex">
              <input
                type="ipaddress"
                className="form-control me-2"
                value={ipaddress}
                onChange={(e) => setIpaddress(e.target.value)}
                placeholder='Ip Address'
              />
            </div>
            <div className="col-md-3 d-flex">
              <button className="btn btn-primary me-2" onClick={handleLogin} disabled={loading}>
                Login and get Cookie
              </button>
            </div>
          </div>
          {/* Form Ends */}
        </div>
        <hr />
        <div className="row col-md-12 text-center">
          <div className="col-md-4">
            <input type="text" value={cookie} className='form-control' />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary me-2" onClick={createmaster} disabled={loading}>
              मास्टर तयार गर्नुहोस्
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary me-2" onClick={handleDownloadgabisa} disabled={loading}>
              गा.वि.स लिष्ट ल्याउनुहोस्
            </button>
          </div>
        </div>

      </div>


      {/* Table - Downloaded Records */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h5>गा.वि.स हरुको लिष्ट</h5>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Gabisa ID</th>
                <th>Gabisa Name</th>
                <th>Gabisa Name Nepali</th>
                <th>Downloaded</th>
                <th>Updated</th>
                <th colSpan={2}>कृयाकलाप</th>
              </tr>
            </thead>
            <tbody>
              {gabisa.length > 0 ? (
                gabisa.map((row, index) => (
                  <tr key={index}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                    <td><button onClick={() => {
                      getdata(row[0], row[1], row[2])
                    }} className='btn btn-sm btn-info' disabled={row[3] == 'Y'}>Download</button></td>
                    <td>
                      <button className="btn btn-primary me-2" onClick={()=>updateToServer(row[0])} disabled={row[4] == 'Y'}>
                        Update To Server
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
