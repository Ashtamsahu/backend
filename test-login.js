// Test script to verify login functionality
// Run with: node test-login.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test123';
const TEST_NAME = 'Test User';

async function testLogin() {
  console.log('🧪 Testing Login Functionality\n');
  
  try {
    // Step 1: Register a test user
    console.log('1️⃣ Registering test user...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/register`, {
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      console.log('✅ Registration:', registerResponse.data);
    } catch (registerError) {
      if (registerError.response?.status === 409) {
        console.log('ℹ️  User already exists, continuing...');
      } else {
        throw registerError;
      }
    }

    // Step 2: Try to login
    console.log('\n2️⃣ Attempting login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    console.log('✅ Login Response Status:', loginResponse.status);
    console.log('✅ Login Response Data:', JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data.status === true && loginResponse.data.token) {
      console.log('\n✅ SUCCESS: Token generated!');
      console.log('Token (first 30 chars):', loginResponse.data.token.substring(0, 30) + '...');
      
      // Step 3: Test authenticated endpoint
      console.log('\n3️⃣ Testing authenticated endpoint with token...');
      const token = loginResponse.data.token;
      
      try {
        const vegResponse = await axios.get(`${BASE_URL}/veg`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('✅ Authenticated request successful!');
        console.log('Response:', vegResponse.data);
      } catch (vegError) {
        console.log('❌ Authenticated request failed:', vegError.response?.data || vegError.message);
      }
    } else {
      console.log('❌ FAILED: No token in response');
      console.log('Response:', loginResponse.data);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testLogin();

