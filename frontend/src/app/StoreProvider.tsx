'use client'
// Import necessary hooks and components from React and Redux
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '../../state/store';
// Import the makeStore function, store, and persistor from the updated store configuration
import { makeStore, persistor } from '../../state/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Use useRef to hold the store instance
  /* const storeRef = useRef(makeStore()); */

  // Since the store creation is now outside and doesn't depend on component lifecycle,
  // we ensure the store is initialized once and used throughout the app lifecycle.
  // This approach replaces the previous conditional store creation logic.
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}