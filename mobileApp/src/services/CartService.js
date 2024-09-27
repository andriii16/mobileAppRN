import {ApiConstants} from "../constants";
import axios from "axios";
import {authHeader} from "../utils/Generator";
import {getToken} from "../Store";

const getCartItems = async () => {
  console.log(`CartService | getCartItems`);
  try {
    let response = await axios.get(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.CART}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: `Podaci o korpi su dostupni`,
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Podaci o korpi nisu pronadjeni`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Podaci o korpi nisu pronadjeni`,
    };
  }
};

const addToCart = async ({flowerId}) => {
  console.log(`CartService | addToCart`);
  try {
    let response = await axios.post(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.CART}/${flowerId}`,
      {},
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: `Proizvod uspjeno dodat u korpu`,
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Dodavanje proizvoda u korpu nije uspjelo`,
      };
    }
  } catch (error) {
    console.log(error?.response);
    return {
      status: false,
      message: `Dodavanje proizvoda u korpu nije uspjelo`,
    };
  }
};

const removeFromCart = async ({flowerId}) => {
  console.log(`CartService | removeFromCart`);
  try {
    let response = await axios.delete(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.CART}/${flowerId}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: `Proizvod uspjesno uklonjen iz korpe`,
        data: response?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Uklanjanje proizvoda iz korpe nije uspjelo`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Uklanjanje proizvoda iz korpe nije uspjelo`,
    };
  }
};

export default {getCartItems, addToCart, removeFromCart};
