import React, { useEffect, useState } from 'react';
import {
  getDetailsByOwner
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';

const SearchByOwner = () => {
  const navigate = useNavigate();
  const [citizenship_no, setCitizenship_no] = useState([]);
  const [idissuedate, setIdissuedate] = useState([]);
  const [ownerdetails, setOwnerDetails] = useState([]);
  const [landdetails, setLandDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState('0-0-0-0');
  const [totsqm, setTotsqm] = useState(0);

  function calculateArea(data) {
    setTotal('0-0-0-0');
    setTotsqm(0);
    let totalSqm = 0;
    let totdaam = 0;
    if (data.length>0) {
      data.forEach((land) => {
        const [raPart, sqmPart] = land.area.split("/").map(p => p.trim());
        let [r, a, p, d] = raPart.split("-").map(Number);
        const sqm = parseFloat(sqmPart); // convert string to number
        totalSqm += sqm; // add to total
        setTotsqm(totalSqm);
        const value = d + p * 4 + a * 4 * 4 + r * 16 * 4 * 4;
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
  // Fetch Effects 

  useEffect(() => {
    console.log(citizenship_no, idissuedate)
    if (citizenship_no.length > 0 && idissuedate.length > 0) {
      const timer = setTimeout(() => {
        fetchDetails(citizenship_no, idissuedate);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [citizenship_no, idissuedate]);


  const fetchDetails = async (citizenship_no, idissuedate) => {
    setLoading(true);
    const res = await getDetailsByOwner(citizenship_no, idissuedate);
    if (res) {
      setOwnerDetails(res.data.data);
      setLandDetails(res.data.data1);
      calculateArea(res.data.data1);     
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
            name="citizenship_no"
            className='form-control'
            value={idissuedate}
            onChange={e => setIdissuedate(e.target.value)}
            placeholder='2065/12/10' />
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
            </tr>
          </thead>
          <tbody>
            {ownerdetails.map((i, index) => (
              <tr key={index}>
                <td>{i.citizenship_no}</td>
                <td>{i.idissuedate}</td>
                <td>{i.owner_name}</td>
                <td>{i.fatherhusbandname}</td>
                <td>{i.grandfatherdname}</td>
                <td>{i.owneraddress}</td>
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
            <th>क्र.स</th>
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
                <td>{index+1}</td>
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

export default SearchByOwner;
