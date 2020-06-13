/** @format */

import { persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";

// You have to import every reducers and combine them.

import { reducer as UserRedux } from "./UserRedux";
import { reducer as ConfigRedux } from "./ConfigRedux";
const config = {
  key: "root",
  storage,
  blacklist: [
  ],
};

export default persistCombineReducers(config, {
  user: UserRedux,
  config: ConfigRedux,
});
