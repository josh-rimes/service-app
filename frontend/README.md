# Frontend – Hotfix Web App
This is the frontend for the Hotfix application, built with React and Vite.
It communicates with the Spring Boot backend via REST APIs.

## Tech Stack

- React
- Vite
- JavaScript
- Axios
- React Router

## Prerequisites
Make sure you have:
- Node.js (v18+ recommended)
- npm or yarn
- Backend running on http://localhost:8080

## Setup Instructions
### 1. Cd into repository
```shell
cd frontend
```
### 2. Install Dependencies
```shell
npm install
```
or
```shell
yarn install
```
### 3. Configure API Base URL

Check `src/api/axios.js`:
```javascript
import axios from "axios";

const api = axios.create({
baseURL: "http://localhost:8080",
});

export default api;
```
Ensure it matches the backend URL.

### 4. Run the Development Server
```shell
npm run dev
```
The frontend will be available at:
```terminaloutput
http://localhost:5173
```

## Application Structure

- api/ - Axios configuration
- components/ - Reusable UI components
- pages/ - Page-level components
- auth/ - Auth helpers (JWT, roles)
- App.jsx

## Authentication Flow
**1.** User logs in

**2.** JWT is returned from backend

**3.** Token is stored (localStorage or context)

**4.** Axios attaches token to all requests

Example:
```javascript
api.interceptors.request.use(config => {
const token = localStorage.getItem("token");
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});
```

## Common Issues & Debugging
### Jobs / Quotes Not Loading
**Possible causes:**

- Backend not running
- Missing JWT token
- Incorrect API endpoint
- 
**Fix:**

- Check Network tab in browser dev tools
- Verify token exists in localStorage
- Confirm endpoint URLs match backend

### 401 / 403 Errors in Frontend

**Causes:**

- Token expired
- User role mismatch
- Authorization header missing

**Fix:**

- Log out and log back in
- Confirm role-based routes
- Ensure Axios interceptor is working

### Undefined IDs (e.g. tradesmanId)
If values like `quote.tradesmanId` are `undefined`:
- Backend DTO may not include the field
- Ensure frontend uses the DTO structure returned by backend
- Log the API response to confirm shape

### CORS Errors

**Error:**
```terminaloutput
Access to XMLHttpRequest has been blocked by CORS policy
```
**Fix:**

- Ensure backend CORS allows localhost:5173
- Restart backend after changes

### Blank Page on Load

**Fix:**

- Check console for routing errors
- Verify React Router paths
- Ensure correct default route

## Development Tips
- Use browser dev tools Network tab extensively
- Log API responses while developing new features
- Keep backend and frontend DTOs in sync
- Restart Vite server after environment changes