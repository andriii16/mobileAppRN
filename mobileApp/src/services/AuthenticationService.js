import axios from "axios";
import {ApiConstants} from "../constants";
import {getToken} from "../Store";
import {authHeader} from "../utils/Generator";

const AuthRequest = axios.create({
  baseURL: ApiConstants.BACKEND_API.BASE_API_URL,
});

const register = async user => {
  if (!user?.username || !user?.email || !user?.password) {
    return {status: false, message: "Molimo Vas, popunite sva polja."};
  }
  try {
    let requestBody = {
      username: user?.username,
      email: user?.email,
      password: user?.password,
      profileImage: "",
    };
    let registerResponse = await AuthRequest.post(
      ApiConstants.BACKEND_API.REGISTER,
      requestBody,
    );
    return registerResponse?.data;
  } catch (error) {
    console.log(error);
    return {status: false, message: "Oops! Nešto nije u redu."};
  }
};

const login = async user => {
  if (!user?.username || !user?.password) {
    return {status: false, message: "Molimo Vas, popunite sva polja."};
  }
  try {
    let requestBody = {
      username: user?.username,
      password: user?.password,
    };
    let loginResponse = await AuthRequest.post(
      ApiConstants.BACKEND_API.LOGIN,
      requestBody,
    );
    return loginResponse?.data;
  } catch (error) {
    console.log(error);
    return {status: false, message: "Oops! Nešto nije u redu."};
  }
};

const checkUserExist = async (type, value) => {
  try {
    let params = {[type]: value};
    let userCheckResponse = await AuthRequest.get(
      ApiConstants.BACKEND_API.USER_EXIST,
      {params},
    );
    return userCheckResponse?.data;
  } catch (error) {
    console.log(error);
    return {status: false, message: "Oops! Nešto nije u redu."};
  }
};

const refreshToken = async () => {
  try {
    let tokenResponse = await AuthRequest.post(
      ApiConstants.BACKEND_API.REFRESH_TOKEN,
      {headers: authHeader(getToken())},
    );
    if (tokenResponse?.status === 200) {
      return {status: true, data: tokenResponse?.data};
    } else {
      return {status: false};
    }
  } catch (error) {
    console.log(error);
    return {status: false, message: "Oops! Nešto nije u redu."};
  }
};

export default {register, login, checkUserExist, refreshToken};
