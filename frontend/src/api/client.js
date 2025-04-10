import axios from 'axios';
import env from "react-dotenv";

const apiClient = axios.create({
  baseURL: env.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export default apiClient;