import {combineReducers} from "redux";
import GeneralReducer from "./GeneralReducer";
import CartReducer from "./CartReducer";
import BookmarkReducer from "./BookmarkReducer";

const rootReducer = combineReducers({
  generalState: GeneralReducer,
  cartState: CartReducer,
  bookmarkState: BookmarkReducer,
});

export default rootReducer;
