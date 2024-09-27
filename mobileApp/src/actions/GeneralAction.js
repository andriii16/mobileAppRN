import {AuthentictaionService, StorageService} from "../services";
import UserService from "../services/UserService";
import CartAction from "./CartAction";
import BookmarkAction from "./BookmarkAction";

const types = {
  SET_IS_APP_LOADING: "SET_IS_APP_LOADING",
  SET_TOKEN: "SET_TOKEN",
  SET_FIRST_TIME_USE: "SET_FIRST_TIME_USE",
  SET_USER_DATA: "SET_USER_DATA",
  SET_PROFILE_IMAGE: "SET_PROFILE_IMAGE",
  LOGOUT: "LOGOUT",
};

const setProfileImage = imageUri => {
  return {
    type: types.SET_PROFILE_IMAGE,
    payload: imageUri,
  };
};

const setIsAppLoading = isAppLoading => {
  return {
    type: types.SET_IS_APP_LOADING,
    payload: isAppLoading,
  };
};

const setToken = token => {
  return {
    type: types.SET_TOKEN,
    payload: token,
  };
};

const setIsFirstTimeUse = () => {
  return {
    type: types.SET_FIRST_TIME_USE,
    payload: false,
  };
};

const setUserData = userData => {
  return {
    type: types.SET_USER_DATA,
    payload: userData,
  };
};

const appStart = () => {
  return (dispatch, getState) => {
    StorageService.getFirstTimeUse().then(isFirstTimeUse => {
      dispatch({
        type: types.SET_FIRST_TIME_USE,
        payload: isFirstTimeUse ? false : true,
      });
    });
    StorageService.getToken().then(token => {
      if (token) {
        console.log("TOKEN", token);
        dispatch({
          type: types.SET_TOKEN,
          payload: token,
        });
        UserService.getUserData().then(userResponse => {
          console.log("User Response:", userResponse);
          if (userResponse?.status) {
            dispatch({
              type: types.SET_USER_DATA,
              payload: userResponse?.data,
            });
            dispatch(CartAction.getCartItems());
            dispatch(BookmarkAction.getBookmarks());
            dispatch({
              type: types.SET_IS_APP_LOADING,
              payload: false,
            });
          } else if (userResponse?.message === "TokenExpiredError") {
            AuthentictaionService.refreshToken().then(tokenResponse => {
              if (tokenResponse?.status) {
                dispatch({
                  type: types.SET_TOKEN,
                  payload: tokenResponse?.data,
                });
                UserService.getUserData().then(userResponse => {
                  if (userResponse?.status) {
                    dispatch({
                      type: types.SET_USER_DATA,
                      payload: userResponse?.data,
                    });
                    dispatch({
                      type: types.SET_IS_APP_LOADING,
                      payload: false,
                    });
                  }
                });
              } else {
                dispatch({
                  type: types.SET_TOKEN,
                  payload: "",
                });
                dispatch({
                  type: types.SET_IS_APP_LOADING,
                  payload: false,
                });
              }
            });
          }
        });
      }
      dispatch({
        type: types.SET_IS_APP_LOADING,
        payload: false,
      });
    });
  };
};

const logout = () => {
  return async dispatch => {
    try {
      await StorageService.removeToken(); // Ovdje koristimo novu funkciju
      dispatch({
        type: types.SET_USER_DATA,
        payload: null,
      });
      dispatch({
        type: types.SET_TOKEN,
        payload: "",
      });
      dispatch({
        type: types.SET_FIRST_TIME_USE,
        payload: true,
      });
      dispatch({
        type: types.SET_PROFILE_IMAGE,
        payload: null,
      });
    } catch (error) {
      console.error("Greška pri odjavi:", error);
    }
  };
};

export default {
  setIsAppLoading,
  setToken,
  appStart,
  setIsFirstTimeUse,
  setUserData,
  setProfileImage,
  logout,
  types,
};
