import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import authReducer from "./slice/auth.slice";
import lookBuilderReducer from "./slice/look-builder.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  lookBuilder: lookBuilderReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version:2
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
