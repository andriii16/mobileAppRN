import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const Store = configureStore({
  reducer: rootReducer,
});

const getToken = () => Store?.getState()?.generalState?.token;

export {Store, getToken};

//i do not need to explicitly import thunk because it is embeded into configureStore
