import {ApiConstants} from "../constants";
import axios from "axios";
import {authHeader} from "../utils/Generator";
import {getToken} from "../Store";

const getShops = async () => {
  console.log(`ShopService | getShops`);
  try {
    let shopResponse = await axios.get(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.SHOP}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (shopResponse?.status === 200) {
      return {
        status: true,
        message: `Podaci o cvjecarama su pronadjeni`,
        data: shopResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Podaci o cvjecarama nisu pronadjeni`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Podaci o cvjecarama nisu pronadjeni`,
    };
  }
};

const getOneShopById = async shopId => {
  console.log(`ShopService | getOneShopById`);
  try {
    let shopResponse = await axios.get(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.SHOP}/${shopId}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (shopResponse?.status === 200) {
      return {
        status: true,
        message: `Pronađeni podaci o cvjećari.`,
        data: shopResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Podaci o cvjećari nisu pronađeni.`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Podaci o cvjećari nisu pronađeni.`,
    };
  }
};

export default {getShops, getOneShopById};
