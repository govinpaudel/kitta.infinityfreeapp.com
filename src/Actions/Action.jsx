import axios from "axios";
const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const checkUser = async () => {
  const user = sessionStorage.getItem('user');
  if (user) {
    return true;
  }
  else {
    return false;
  }
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

export const getCookiebyUser = async (username, password) => {
  const form = new URLSearchParams({
    hidBioDataForUser: "",
    txtCapturedFIR: "",
    j_username: username,
    j_password: password,
  });
  try {
    const res = await axios.post(
      "/lrims/lrims/j_spring_security_check",
      form.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        maxRedirects: 0,           // stop at 302
        validateStatus: () => true // allow 302
      }
    );

    console.log("STATUS:", res.status);
    console.log("HEADERS:", res.headers);
// Grab JSESSIONID manually
    const setCookie = res.headers["set-cookie"];
    if (!setCookie || !setCookie.length) {
      console.error("❌ No Set-Cookie header found");
      return;
    }

    const jsession = setCookie
      .map(c => c.split(";")[0])
      .find(c => c.startsWith("JSESSIONID="));

    if (!jsession) {
      console.error("❌ JSESSIONID not found in Set-Cookie");
      return;
    }

    console.log("✅ JSESSIONID:", jsession);


  } catch (error) {
    console.error("❌ Login error:", error.message);
  }
}


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