import React, { useEffect, useState } from 'react';
import {
  checkUser,
  getGabisas, getWards, getDetailsByKittaNo
} from "../Actions/Action";
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../Loading/LoadingOverlay';

const Search = () => {
  const navigate = useNavigate();
  const [gabisas, setGabisas] = useState([]);
  const [wards, setWards] = useState([]);
  const [gabisa_id, setGabisa_id] = useState(0);
  const [ward_no, setWard_no] = useState(0);
  const [kitta_no, setKitta_no] = useState(0);
  const [ownerdetails, setOwnerDetails] = useState([]);
  const [landdetails, setLandDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Effects  
  useEffect(() => { checkifUserExists(); }, []);
  useEffect(() => { fetchGabisas(); }, []);
  useEffect(() => { if (gabisa_id > 0) fetchWards(gabisa_id); }, [gabisa_id]);
  useEffect(() => {
    if (gabisa_id > 0 && ward_no > 0 && kitta_no > 0) {
      const timer = setTimeout(() => {
        fetchDetails(gabisa_id, ward_no, kitta_no);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gabisa_id, ward_no, kitta_no]);

  const checkifUserExists = async () => {
    const check = await checkUser();
    if (!check) {
      navigate("/login");
    }
  }
  const fetchGabisas = async () => {
    setLoading(true);
    const res = await getGabisas()
    if (res) setGabisas(res.data.data);
    setLoading(false);
  };

  const fetchWards = async (gabisa_id) => {
    setLoading(true);
    const res = await getWards(gabisa_id);
    if (res) setWards(res.data.data);
    setLoading(false);
  };

  const fetchDetails = async (gabisa_id, ward_no, kitta_no) => {
    setLoading(true);
    const res = await getDetailsByKittaNo(gabisa_id, ward_no, kitta_no);
    if (res) {
      setOwnerDetails(res.data.data);
      setLandDetails(res.data.data1)
    }
    setLoading(false);
  };

  return (
    <section className="container my-4">
      <LoadingOverlay loading={loading} message="कृपया प्रतिक्षा गर्नुहोस्..." />
      <h4 className="text-success text-center mb-3">कित्ता कसको नाउँमा छ हेर्नुहोस्</h4>
      {/* Form Fields */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <select
            className="form-select"
            value={gabisa_id}
            onChange={e => setGabisa_id(Number(e.target.value))}          >
            <option value="0" disabled>--गा.वि.स छान्नुहोस्--</option>
            {gabisas.map((g) => (
              <option key={g.municipalityvdcid} value={g.municipalityvdcid}>{g.landmunicipalityvdc}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md">
          <select
            className="form-select"
            value={ward_no}
            disabled={!gabisas.length}
            onChange={e => setWard_no(Number(e.target.value))}
          >
            <option value="0" disabled>--वडा नं छान्नुहोस्--</option>
            {wards.map((w) => (
              <option key={w.wardno} value={w.wardno}>{w.wardno}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md">
          <input
            type="number"
            min={1}
            className="form-control"
            placeholder="कित्ता नं"
            value={kitta_no}
            disabled={!ward_no}
            onChange={e => setKitta_no(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="table-responsive mb-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>नागरिकता नं</th>
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
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Search;
