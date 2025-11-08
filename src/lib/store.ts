import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "../app/redux/slice/auth.slice"
import lookBuilderReducer from "../app/redux/slice/look-builder.slice";
import addInvitedEventDetails from '@/app/redux/slice/invited-event.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  lookBuilder: lookBuilderReducer,
  invitedEvent: addInvitedEventDetails
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','lookBuilder','invitedEvent'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
