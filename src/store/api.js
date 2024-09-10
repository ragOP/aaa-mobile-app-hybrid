import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = axios.create({
  baseURL: "https://aaa-backend-ip49.onrender.com",
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