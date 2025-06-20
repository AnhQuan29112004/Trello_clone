import { LoginResponse, RegisterResponse } from './../../types/auth.type';
import { AxiosResponse } from "axios";
import api from "../api";
import { BaseResponse } from "../../types/types";

class AuthService {
  private urlEndPoint: string;
  private urlVersion: string;

  constructor() {
    this.urlEndPoint = 'auth';
    this.urlVersion = process.env.API_VERSION || 'v1';
  }


  async login(email: string, password: string): Promise<BaseResponse<LoginResponse>> {
    try {
      const url = `/${this.urlVersion}/${this.urlEndPoint}/login`;
      const response = await api.post(url, { email, password });
      return response.data;
    } catch (error: any) {
      const url = `/${this.urlVersion}/${this.urlEndPoint}/login`;
      console.log("api:", process.env.BASE_URL_MOBILE);
      console.log("url", url);
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  async register(email: string, passWord: string, last_name: string, first_name: string, phone_number: string, username: string, confirmPassWord: string): Promise<BaseResponse<RegisterResponse>> {
    try {
      const url = `/${this.urlVersion}/${this.urlEndPoint}/register`;
      console.log("email", email)
      const response = await api.post(url, {
        email, passWord, last_name, first_name, phone_number, username, confirmPassWord
      });
      console.log("response", response)
      console.log("response", response.data)
      return response.data;
    } catch (error) {
      const url = `/${this.urlVersion}/${this.urlEndPoint}/register`;
      console.log("url", url)
      console.log(error)
      throw error;
    }
  }
}

export default new AuthService()
