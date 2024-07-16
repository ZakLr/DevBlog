import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userSlice from './features/user/userSlice';

// Function to check if localStorage is available
function storageAvailable() {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Fallback storage if localStorage is not available
const fallbackStorage = {
  getItem: (key: string) => Promise.resolve(null),
  setItem: (key: string, value: any) => Promise.resolve(),
  removeItem: (key: string) => Promise.resolve(),
};

// Choose the appropriate storage
const chosenStorage = storageAvailable() ? storage : fallbackStorage;

// Configuration for redux-persist
const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: chosenStorage,
};



// Wrap the reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userSlice);

export const makeStore = () => {
  return configureStore({
    reducer: {
      users: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'], // Ignore the actions from redux-persist
        },
        
      }),
  });
};

// Create the store and persistor
export const store = makeStore();
const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Export the persistor
export { persistor };