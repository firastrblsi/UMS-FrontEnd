import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../../modules/auth/redux/authSlice";
import uiReducer from "../../core/store/slices/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
