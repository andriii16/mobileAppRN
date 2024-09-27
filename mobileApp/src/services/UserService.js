import {ApiConstants} from "../constants";
import axios from "axios";
import {authHeader} from "../utils/Generator";
import {getToken} from "../Store";

const getUserData = async () => {
  console.log(`UserService | getUserData`);
  try {
    let userResponse = await axios.get(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.USER}/get-user`,
      {
        headers: authHeader(getToken()),
      },
    );

    if (userResponse?.status === 200) {
      return {
        status: true,
        message: `Podaci o korisniku`,
        data: userResponse?.data,
      };
    } else {
      return {
        status: false,
        message: `Korisnik nije pronađen`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : `Podaci o korisniku nisu pronađeni`,
    };
  }
};

const updateProfileImage = async imageUri => {
  console.log(`UserService | updateProfileImage`);
  try {
    let updateResponse = await axios.post(
      `${ApiConstants.BACKEND_API.BASE_API_URL}${ApiConstants.BACKEND_API.USER}/update-profile-image`,
      {imageUri},
      {
        headers: authHeader(getToken()),
      },
    );

    if (updateResponse?.status === 200 && updateResponse?.data?.status) {
      return {
        status: true,
        message:
          updateResponse?.data?.message || "Profile image updated successfully",
      };
    } else {
      return {
        status: false,
        message: updateResponse?.data?.message || "Profile image update failed",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : "Failed to update profile image",
    };
  }
};

export default {getUserData, updateProfileImage};
