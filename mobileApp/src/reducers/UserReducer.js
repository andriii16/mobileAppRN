const initialState = {
  userData: {},
  token: "",
  isFirstTimeUse: true,
  isAppLoading: false,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default UserReducer;
