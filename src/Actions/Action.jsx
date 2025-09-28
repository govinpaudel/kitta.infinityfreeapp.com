import axios from "axios";
const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const getGabisas = async () => {
  const res = await axios.get(`${API_URL}/getGabisas`);
  console.log(`${API_URL}/getGabisas`)
  return res;
};

export const getWards = async (gabisa_id) => {
  const res = await axios.get(`${API_URL}/getWards/${gabisa_id}`);
  console.log(`${API_URL}/getWards/${gabisa_id}`)
  return res;
};

export const getDetailsByKittaNo = async (gabisa_id,ward_no,kitta_no) => {
  const res = await axios.get(`${API_URL}/getDetailsByKittaNo/${gabisa_id}/${ward_no}/${kitta_no}`);
  console.log(`${API_URL}/getDetailsByKittaNo/${gabisa_id}/${ward_no}/${kitta_no}`)
  return res;
};

export const getDataByDate = async (date) => {
  const res = await axios.get(`http://10.7.33.8:5000/api/bargikaran/getDataByDate/${date}`);
  console.log(`http://10.7.33.8:5000/api/bargikaran/getDataByDate/${date}`);
  return res;
};

export const sendRecordsToServer = async (records) => {
  // Send raw array instead of { records: [...] }
  const res = await axios.post(`${API_URL}/saveRecords`, records, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Sending to:", `${API_URL}/saveRecords`, records);
  console.log("Response:", res.data);
  return res;
};