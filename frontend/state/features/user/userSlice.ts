import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../lib/types';

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    loadUserFromLocalStorage(state) {
      const user = localStorage.getItem('currentUser');
      if (user) {
        state.currentUser = JSON.parse(user);
      }
    },
    logout(state) {
      state.currentUser = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('access-token');
    },
  },
});

export const { setCurrentUser, loadUserFromLocalStorage,logout } = userSlice.actions;

export default userSlice.reducer;