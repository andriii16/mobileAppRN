import {GeneralAction} from "../actions";

const initialState = {
  isAppLoading: true,
  token: "",
  isFirstTimeUse: true,
  userData: {},
  profileImage: "",
};

const GeneralReducer = (state = initialState, action) => {
  switch (action.type) {
    case GeneralAction.types.SET_IS_APP_LOADING:
      return {...state, isAppLoading: action.payload};
    case GeneralAction.types.SET_TOKEN:
      return {...state, token: action.payload};
    case GeneralAction.types.SET_FIRST_TIME_USE:
      return {...state, isFirstTimeUse: action.payload};
    case GeneralAction.types.SET_USER_DATA:
      return {...state, userData: action.payload};
    case GeneralAction.types.LOGOUT:
      return {
        ...state,
        token: "",
        userData: null,
        isFirstTimeUse: true,
      };
    case GeneralAction.types.SET_PROFILE_IMAGE:
      return {...state, profileImage: action.payload};
    default:
      return state;
  }
};

export default GeneralReducer;
