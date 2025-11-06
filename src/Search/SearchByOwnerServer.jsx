import React, { useEffect, useState } from 'react';
import {
  getDetailsByOwnerServer,getLandByOwnerServer
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';
import districts from './distdata';
const SearchByOwnerServer = () => {
  const navigate = useNavigate();
  const [citizenship_no, setCitizenship_no] = useState([]);
  const [idissuedate, setIdissuedate] = useState(0);
  const [district_id, setDistrict_id] = useState([]);
  const [ownerdetails, setOwnerDetails] = useState([]);
  const [landdetails, setLanddetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState('0-0-0-0');
  const [totsqm, setTotsqm] = useState(0);

  // Fetch Effects 

  useEffect(() => {
    console.log(citizenship_no, idissuedate, district_id)
    if (citizenship_no.length > 0 && idissuedate.length > 0 && district_id > 0) {
      const timer = setTimeout(() => {
        fetchDetails(citizenship_no, idissuedate, district_id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [citizenship_no, idissuedate, district_id]);

  const fetchland = async (id) => {
    console.log(id);
    setLoading(true);
    const data = {
      contactid: id,      
      cookie: sessionStorage.getItem('cookie'),
      ipaddress: sessionStorage.getItem('ipaddress')
    }
    const res = await getLandByOwnerServer(data);
    if (res) {
      console.log(res.data.data);
      setLanddetails(res.data.data.propertydetails);
    }
    setLoading(false);
  }

  const fetchDetails = async (citizenship_no, idissuedate, district_id) => {
    setLoading(true);
    const data = {
      citizenship_no: citizenship_no,
      idissuedate: idissuedate.replaceAll("-", "/"),
      district_id: district_id,
      cookie: sessionStorage.getItem('cookie'),
      ipaddress: sessionStorage.getItem('ipaddress')
    }
    const res = await getDetailsByOwnerServer(data);
    if (res) {
      console.log(res.data.data);
      setOwnerDetails(res.data.data);
    }
    setLoading(false);
  };

  return (
    <section className="container my-4">
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <button className='btn btn-primary' onClick={() => { navigate("/dashboard") }}>पछाडी जानुहोस् ।</button>
      <h4 className="text-success text-center mb-3">नागरिकता नं बाट खोज्नुहोस्</h4>
      {/* Form Fields */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <input type="text"
            name="citizenship_no"
            className='form-control'
            value={citizenship_no}
            onChange={e => setCitizenship_no(e.target.value)}
            placeholder='१२३' />
        </div>
        <div className="col-12 col-md">
          <input type="text"
            name="idissuedate"
            className='form-control'
            value={idissuedate}
            onChange={e => setIdissuedate(e.target.value)}
            placeholder='2065/12/10' />
        </div>
        <div className="col-12 col-md">
          <select name='district_id' value={district_id} className='form-control' onChange={e => setDistrict_id(e.target.value)}>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>नागरिकता नं</th>
              <th>जारी मितिः</th>
              <th>जग्गाधनीको नाम</th>
              <th>बाबु / पतिको नाम</th>
              <th>बाजे / ससुराको नाम</th>
              <th>ठेगाना</th>
              <th>कृयाकलाप</th>
            </tr>
          </thead>
          <tbody>
            {ownerdetails.map((i, index) => (
              <tr key={index}>
                <td>{i.idno}</td>
                <td>{i.idissuedate}</td>
                <td>{i.firstname} {i.middlename} {i.lastname}</td>
                <td>{i.fatherfirstname}{i.fathermiddlename}{i.fatherlastname}</td>
                <td>{i.grandfatherfirstname}{i.grandfathermiddlename}{i.grandfatherlastname}</td>
                <td>{i.municipalityvdcname_np}</td>
                <td><button className='btn btn-sm btn-info' onClick={() => fetchland(i.contactid)}>श्रेष्ता हेर्नुहोस्</button></td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
      {/* Results Table */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>गा.वि.स.</th>
              <th>वडा नं</th>
              <th>कित्ता नं</th>
              <th>किसिम</th>
              <th>प्रकार</th>
              <th>विरह</th>
              <th>क्षेत्रफल</th>
              <th>मोठ</th>
              <th>पाना.नं.</th>
            </tr>
          </thead>
          <tbody>
            {landdetails.map((i, index) => (
              <tr key={index}>
                <td>{i.landmunicipalityvdc}</td>
                <td>{i.wardno}</td>
                <td>{i.presentparcleno}</td>
                <td>{i.landtype_np}</td>
                <td>{i.classtype_np}</td>
                <td>{i.landusetype_np}</td>
                <td>{i.area}</td>
                <td>{i.mothno}</td>
                <td>{i.pageno}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={6}>जम्मा</td>
              <td colSpan={3}>{total} / {totsqm} वर्ग मिटर</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SearchByOwnerServer;
