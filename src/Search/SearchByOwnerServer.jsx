import React, { useEffect, useState } from 'react';
import {
  getDetailsByOwnerServer, getLandByOwnerServer
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';
import districts from './distdata';
import { toast } from "react-toastify";
const SearchByOwnerServer = () => {
  const navigate = useNavigate();
  const [first_name, setFirst_name] = useState("");
  const [citizenship_no, setCitizenship_no] = useState("");
  const [idissuedate, setIdissuedate] = useState("");
  const [district_id, setDistrict_id] = useState("");
  const [ownerdetails, setOwnerDetails] = useState([]);
  const [landdetails, setLanddetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState('0-0-0-0');
  const [totsqm, setTotsqm] = useState(0);

  function calculateArea(data) {
    console.log("summing area");
    setTotal('0-0-0-0');
    setTotsqm(0);
    let totalSqm = 0;
    let totdaam = 0;
    if (data.length > 0) {
      data.forEach((land) => {
        const sqm = parseFloat(land.area5); // convert string to number
        totalSqm += sqm; // add to total
        setTotsqm(totalSqm);
        const value = land.area4 + land.area3 * 4 + land.area2 * 4 * 4 + land.area1 * 16 * 4 * 4;
        totdaam += value;
      });
      console.log(totdaam);
      let daam = totdaam % 4; // remcainder after converting to paisa
      let totalPaisa = Math.floor(totdaam / 4);

      let paisa = totalPaisa % 4; // remainder after converting to aana
      let totalAana = Math.floor(totalPaisa / 4);

      let aana = totalAana % 16; // remainder after converting to ropani
      let ropani = Math.floor(totalAana / 16);
      console.log(`${ropani}-${aana}-${paisa}-${daam}`)
      setTotal(`${ropani}-${aana}-${paisa}-${daam}`);

    }
  }

  const fetchland = async (id) => {
    setLoading(true);
    const data = {
      contactid: id,
      cookie: sessionStorage.getItem('cookie'),
      ipaddress: sessionStorage.getItem('ipaddress')
    }

    const res = await getLandByOwnerServer(data);
    if (res) {
      console.log(res.data.data.propertydetails);
      const sortedData = [...res.data.data.propertydetails].sort((a, b) => {
        // Compare by muncname_np (string)
        const muncCompare = a.muncname_np.localeCompare(b.muncname_np);
        if (muncCompare !== 0) return muncCompare;

        // Compare by wardnumber (numeric)
        const wardCompare = Number(a.wardnumber) - Number(b.wardnumber);
        if (wardCompare !== 0) return wardCompare;

        // Compare by presentparcleno (string or number)
        if (typeof a.presentparcleno === "number" && typeof b.presentparcleno === "number") {
          return a.presentparcleno - b.presentparcleno;
        } else {
          return String(a.presentparcleno).localeCompare(String(b.presentparcleno));
        }
      });
      // Now set the sorted array into state
      setLanddetails(sortedData);
      calculateArea(res.data.data.propertydetails);

    }
    setLoading(false);
  }

  const fetchDetails = async () => {
    const cookie = sessionStorage.getItem('cookie');
    const ipaddress = sessionStorage.getItem('ipaddress');
    if (!cookie || !ipaddress) {
      toast.warning("खोजिका लागि लगईन गर्नुहोला ।")
      return;
    }
    console.log(citizenship_no, idissuedate, district_id, first_name);
    if (!citizenship_no && !idissuedate && !district_id && !first_name) {
      toast.warning("खोजिका लागि कुनै एक चिज प्रविष्ट गर्नुहोस् ")
      return;
    }
    setLoading(true);
    const data = {
      first_name: first_name || '',
      citizenship_no: citizenship_no || '',
      idissuedate: idissuedate || '',
      district_id: district_id || '',
      cookie: sessionStorage.getItem('cookie') || '',
      ipaddress: sessionStorage.getItem('ipaddress') || ''
    }
    console.log(data);
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
            name="first_name"
            className='form-control'
            value={first_name}
            onChange={e => setFirst_name(e.target.value)}
            placeholder='पहिलो नाम' />
        </div>
        <div className="col-12 col-md">
          <input type="text"
            name="citizenship_no"
            className='form-control'
            value={citizenship_no}
            onChange={e => setCitizenship_no(e.target.value)}
            placeholder='ना.प्र.नं' />
        </div>
        <div className="col-12 col-md">
          <input type="text"
            name="idissuedate"
            className='form-control'
            value={idissuedate}
            onChange={e => setIdissuedate(e.target.value)}
            placeholder='जारी मिति' />
        </div>
        <div className="col-12 col-md">
          <select name='district_id' value={district_id ?? ""} className='form-control' onChange={e => setDistrict_id(e.target.value)}>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md">
          <button className='btn btn-sm btn-primary' onClick={(e) => {
            fetchDetails()
          }}>खोज्नुहोस्</button>
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
              <th>हकहिस्सा</th>
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
                <td>{i.muncname_np}</td>
                <td>{i.wardnumber}</td>
                <td>{i.presentparcleno}</td>
                <td>{i.ownershipsharetypeNp}</td>
                <td>{i.landtype_Np}</td>
                <td>{i.classtype_np}</td>
                <td>{i.landusetypeNp}</td>
                <td>{i.area1}-{i.area2}-{i.area3}-{i.area4}/{i.area5}</td>
                <td>{i.mothNo}</td>
                <td>{i.pageNo}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={7}>जम्मा</td>
              <td colSpan={4}>{total} / {totsqm} वर्ग मिटर</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SearchByOwnerServer;
