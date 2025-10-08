import { useNavigate } from 'react-router-dom';
import { checkUser, createMaster, getCookiebyUser, getGabisaList, getDataByGabisa, sendRecordsToServer } from '../Actions/Action';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import LoadingOverlay from '../Loading/LoadingOverlay';


const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gabisa, setGabisas] = useState([]);
  const [data, setData] = useState([]);

  const checkifUserExists = async () => {
    const check = await checkUser();
    if (!check) {
      navigate("/login");
    }
  }
  useEffect(
    () => {
      checkifUserExists();
    }, []
  )


  const handleLogin = async () => {
    if (!username || !password) {
      toast.warning("कृपया प्रयोगकर्ता र पासवर्ड प्रविष्ट गर्नुहोस् ।");
      return;
    }
    try {
      setLoading(true);
      const response = await getCookiebyUser(username, password);
      if (response.data.status = true) {
        toast.success(response.data.message);
        sessionStorage.setItem('cookie', response.data.data)
      }
    } catch (err) {
      toast.error("डेटा ल्याउन असफल भयो");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadgabisa = async () => {
    const res = await getGabisaList();
    setGabisas(res.data.data);
    console.log(res);
  }
  const createmaster = async () => {
    const res = await createMaster();
    if (res.data.status == true) {
      toast.success(res.data.message)
    }
  }

  const updateToServer = async () => {
    if (data.length == 0) {
      toast.warning('कुनै पनि डाटा छैन');
      return;
    }
    const res = await sendRecordsToServer(data);
    if (res.data.status == true) {
      toast.success(res.data.message)
    }
  }

  const getdata = async (a) => {
    const b = sessionStorage.getItem('cookie');
    if (!b) {
      toast.warning('लगईन भएको छैन ।')
      return;
    }
    const res = await getDataByGabisa(a, b);
    if (res.status = true) {
      setData(res.data.data);
      toast.success(`जम्मा ${res.data.data.length} डाटा प्राप्त भयो`)
    }
    console.log(res);
  }

  return (
    <div className="container mt-5 position-relative">
      {loading && <LoadingOverlay loading={loading} />}

      {/* Dashboard Header */}
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <h4 className="mb-0">सर्भरबाट डाटा तान्नुहोस्</h4>
            </div>
          </div>
          <button className="btn btn-primary me-2" onClick={createmaster} disabled={loading}>
            मास्टर तयार गर्नुहोस्
          </button>
          <button className="btn btn-primary me-2" onClick={handleDownloadgabisa} disabled={loading}>
            गा.वि.स लिष्ट ल्याउनुहोस्
          </button>
        </div>

      </div>

      {/* Form starts */}
      <div className="row mt-4">
        <div className="col-md-4 d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='username'
          />
        </div>
        <div className="col-md-4 d-flex">
          <input
            type="password"
            className="form-control me-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='password'
          />
        </div>
        <div className="col-md-4 d-flex">
          <button className="btn btn-primary me-2" onClick={handleLogin} disabled={loading}>
            Login and get Cookie
          </button>
        </div>
      </div>
      {/* Form Ends */}
      {/* Table - Downloaded Records */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h5>गा.वि.स हरुको लिष्ट</h5>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Gabisa ID</th>
                <th>Gabisa Name</th>
                <th>गा.वि.सको नाम</th>
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
                    <td><button onClick={() => {
                      getdata(row[0], row[1], row[2])
                    }} className='btn btn-sm btn-info' >Download</button></td>
                    <td>
                      <button className="btn btn-primary me-2" onClick={updateToServer} disabled={loading}>
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
