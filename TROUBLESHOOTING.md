# Troubleshooting Guide: Login & Token Issues

## Problem
- Login fails with "Invalid password"
- Token not being stored in localStorage
- API requests return 401 Unauthorized

## Quick Fix Steps

### Step 1: Register a New Account
If your account was created before password hashing was implemented, register a new account:

```bash
# Using curl (or use your frontend registration form)
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Step 2: Check Backend Logs
When you try to login, check your backend console. You should see:
- `Login attempt for: your@email.com`
- `Password format: HASHED` or `PLAIN TEXT`
- `Bcrypt comparison result: true/false`

### Step 3: Verify Frontend Login Code
Your `Login.jsx` should handle the response like this:

```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post('/api/v1/login', {
      email: email,
      password: password
    });

    console.log('Full response:', response);
    console.log('Response data:', response.data);

    // IMPORTANT: Check response.data.status and response.data.token
    if (response.data.status === true && response.data.token) {
      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('✅ Token stored:', response.data.token);
      console.log('✅ User stored:', response.data.user);
      
      // Redirect or update state
      // navigate('/dashboard');
    } else {
      // Handle error
      console.error('❌ Login failed:', response.data.message);
      alert(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      alert(error.response.data.message || 'Login failed');
    }
  }
};
```

### Step 4: Configure Axios to Send Token
You need to send the token with every authenticated request. Create an axios instance:

**Create `src/api.js` or `src/utils/axios.js`:**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Update your `vegSlice.js`:**

```javascript
import api from './api'; // or wherever you put the axios config

export const fetchVegItems = createAsyncThunk(
  'veg/fetchVegItems',
  async () => {
    const response = await api.get('/veg'); // Token automatically added
    return response.data;
  }
);
```

## Testing

### Test Login with curl:
```bash
# Register
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Use token for authenticated request
curl -X GET http://localhost:3000/api/v1/veg \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

1. **"Invalid password"**: 
   - Register a new account (old accounts may have incompatible password format)
   - Check backend logs to see password comparison details

2. **Token not stored**:
   - Check that `response.data.status === true`
   - Check that `response.data.token` exists
   - Verify you're accessing `response.data.token`, not `response.token`

3. **401 Unauthorized**:
   - Ensure token is stored: `localStorage.getItem('token')`
   - Verify Authorization header: `Authorization: Bearer <token>`
   - Check Network tab in DevTools to see if header is sent

4. **Environment Variables**:
   - Ensure `.env` file has `JWT_SECRET` set
   - Restart server after changing `.env`

