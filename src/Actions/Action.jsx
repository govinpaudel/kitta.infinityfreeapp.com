import axios from "axios";
const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const createMaster = async () => {
  const res = await axios.post(`${API_URL}/createMaster`, {});
  return res;
}


export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log(`${API_URL}/login`, data)
  return res;
}


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

export const getDetailsByKittaNo = async (gabisa_id, ward_no, kitta_no) => {
  const res = await axios.get(`${API_URL}/getDetailsByKittaNo/${gabisa_id}/${ward_no}/${kitta_no}`);
  console.log(`${API_URL}/getDetailsByKittaNo/${gabisa_id}/${ward_no}/${kitta_no}`)
  return res;
};

export const getDetailsByOwner = async (citizenship_no, idissuedate) => {
  const res = await axios.get(`${API_URL}/getDetailsByOwner/${citizenship_no}/${idissuedate}`);
  console.log(`${API_URL}/getDetailsByOwner/${citizenship_no}/${idissuedate}`)
  return res;
};


export const getCookiebyUser = async (username, password,ipaddress) => {
  const data = {
    hidBioDataForUser: "",
    txtCapturedFIR: "",
    username: username,
    password: password,
  }
  const res = await axios.post(`http://${ipaddress}:5000/api/bargikaran/getCookiebyUser`, data);
  console.log(`http://${ipaddress}:5000/api/bargikaran/getCookiebyUser`, data);
  return res;
}

export const getGabisaList = async (ipaddress) => {
  const res = await axios.get(`http://${ipaddress}:5000/api/bargikaran/getGabisalist`);
  console.log(`http://${ipaddress}:5000/api/bargikaran/getGabisalist`);
  return res;
};

export const getDataByGabisa = async (a,b,ipaddress) => {
  const res = await axios.get(`http://${ipaddress}:5000/api/bargikaran/getDataByGabisa/${a}/${b}`);
  console.log(`http://${ipaddress}:5000/api/bargikaran/getDataByGabisa`);
  return res;
};

export const getDetailsByOwnerServer = async(data)=>{
  const res =await axios.post(`http://${data.ipaddress}:5000/api/bargikaran/getDataById`,data);
  console.log(`http://${data.ipaddress}:5000/api/bargikaran/getDataById`,data);
  return res;
}

export const sendRecordsToServer = async (records) => {`http://${data.ipaddress}:5000/api/bargikaran/getDataByGabisa`,data
  console.log(records);
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