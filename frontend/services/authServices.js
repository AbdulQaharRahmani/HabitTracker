import axios from "axios";
import api from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/**
 * We use raw axios to avoid the 429 error. This happens because when we
 * send a refresh token request and the token is expired, if we use
 * 'api.post', it will use the previous expired token to send the request.
 * This fails, triggering the interceptor again to send another request,
 * which leads to an infinite loop.
 */

export const refreshToken = async () => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    console.log(response.data)
    return response.data.token;
  }

export const logout = async ()=>{
   await api.post("/auth/logout")
}

