const axios = require('axios');

async function testLogin() {
  const BASE_URL = 'https://backend-production-83b1.up.railway.app';
  console.log("Starting login test to:", BASE_URL);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin@kamlog.cm',
      password: 'admin123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log("Login Success! Response data:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Login Failed! Status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
  }
}

testLogin();
