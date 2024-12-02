import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = axios.create({
  baseURL: "https://aaa-backend-prcc.onrender.com",
});

API.interceptors.request.use(async(req) => {
  const token = await AsyncStorage.getItem("aaa_token",);
  console.log(token,"AsyncStorage")
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  return req;
});
//Auth API
export const engineerloginApi = (body) => API.post("/api/engineer/login", body);
export const customerloginApi = (body) => API.post("/api/customer/login", body);
//Customer Api
// API call to submit a new complaint
export const newComplaintApi = (customerId, formData) => {
  return API.post(`/api/customer/new-complaint/${customerId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getComplaintsApi = (id) => API.get(`/api/customer/my-complaint/${id}`);
export const getProjectsApi = (id) => API.get(`/api/customer/get-all-projects`);
export const getMyProfile = () => API.get('/api/customer/get-user');
export const raisePrority = (id) => API.patch(`api/customer/raise-priorty/${id}`);
