"use-client";
import {
  EnhancedStore,
  Tuple,
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";
import thunkMiddleware, { thunk } from "redux-thunk";
import logger from "redux";
import { ThunkMiddleware } from "redux-thunk";
// import geoQuizSlice from "./features/geolocationQuizSlice";
import userAuthReducer from "./features/AuthContext";
// import {
//   setCookie,
//   getCookie,
//   removeCookie,
// } from "@/lib/utils/helperAuth";
// import resultSlice from "./features/resultSlice";

// interface ItemProps {
//     auth: any;
// }

// const CookieStore = {
//   setItem: async (key: string, val: string, callback: (arg0: null) => void) => {
//     key = key.replace(":", "_");
//     const value = JSON.parse(val);
//     console.log(value);
//     const authVal = value.user;
//     delete value.auth;
//     localStorage.setItem(key, JSON.stringify(value));
//     setCookie(key, JSON.stringify(authVal), 60 * 60 * 24 * 30);
//     if (callback) {
//       callback(null);
//     }
//     return Promise.resolve(null);
//   },
//   getItem: async (key: string, callback: (arg0: null, arg1: string) => void) => {
//     console.log(key);
//     console.log(callback);
//     key = key.replace(":", "_");
//     const dataItem = localStorage.getItem(key);
//     let item = {} as ItemProps;
//     if (dataItem) item = JSON.parse(dataItem);
//     const authItem = JSON.parse(getCookie(key));
//     if (authItem) item.auth = authItem;
//     if (callback) {
//       callback(null, JSON.stringify(item));
//     }
//     return Promise.resolve(JSON.stringify(item));
//   },
//   removeItem: async (key: string, callback: (arg0: null) => void) => {
//     console.log(key);
//     console.log(callback);
//     removeCookie(key);
//     localStorage.removeItem(key);
//     if (callback) {
//       callback(null);
//     }
//     return Promise.resolve(null);
//   },
// };

// const persistAuthConfig = {
//   key: "root",
//   version: 1,
//   storage: CookieStore,
// };

const authXReducer = combineReducers({
  //   geoQuiz: geoQuizSlice,
  user: userAuthReducer.reducer,
  //   results: resultSlice,
});

// const persistedReducer = persistReducer(persistAuthConfig, authXReducer);

export const store = configureStore({
  reducer: authXReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: { authXReducer },
  });
};

// Infer the type of store
export type RootState = ReturnType<typeof authXReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export default authXReducer;
export type AppStore = EnhancedStore<RootState>;
export type AppDispatch = AppStore["dispatch"];

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
