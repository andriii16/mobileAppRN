import {ApiConstants} from "../constants";
import axios from "axios";
import {authHeader} from "../utils/Generator";
import {getToken} from "../Store";

const getOneFlowerById = async flowerId => {
  console.log(`FlowerService | getOneFlowerById`);
  try {
    let flowerResponse = await axios.get(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.FLOWER}/${flowerId}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (flowerResponse?.status === 200) {
      return {
        status: true,
        message: `Podaci o proizvodu pronadjeni`,
        data: flowerResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Podaci o proizvodu nisu pronadjeni`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Podaci o proizvodu nisu pronadjeni`,
    };
  }
};

export default {getOneFlowerById};
