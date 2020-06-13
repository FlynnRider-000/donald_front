import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "../redux/index";

import { persistStore } from 'redux-persist'

const middleware = [
    thunk,
    // more middleware
];

const store = () => {
    let store = null;
    store = compose(applyMiddleware(...middleware))(createStore)(reducers);
    let persistor = persistStore(store)
    return { store, persistor }
};
  
export default store();
  