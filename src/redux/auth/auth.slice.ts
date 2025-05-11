import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserStatus } from '../../data/auth/user.model';
import { RootState } from '../store';
import { getCurrentUserAsync, loginAsync } from '../../services/auth/auth.service';
import { EmployeeChangeRequest, OnboardingEmployee } from 'src/data/employee/onboarding.model';
import { initEmployeeDetail } from '../employee/employees.slice';
import {
  initBankInfo,
  initDetailInfo,
  initEmergencyContact,
  initGeneralInfo,
  initGovernmentInfo,
  initOthersInfo,
  initSalary,
} from '../onboarding/onboarding.slice';

export type AuthState = {
  currentUser: User;
  currentOnboardingStep: number;
  isLoggedIn: boolean;
  error: string | null;
};

export const initUserState: AuthState = {
  currentUser: {
    id: '',
    email: '',
    avatar: '',
    displayName: '',
    username: '',
    createdAt: '',
    resetToken: '',
    status: UserStatus.PENDING,
    roles: [],
  },
  currentOnboardingStep: -1,
  isLoggedIn: false,
  error: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initUserState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
      return state;
    },
    resetAuthState: (state) => {
      state = initUserState;
      return state;
    },
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.currentOnboardingStep = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown Error';
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.currentOnboardingStep = action.payload.currentOnboardingStep;
        state.isLoggedIn = true;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.error.message ?? 'Unknown Error';
      });
  },
});

export const { login, resetAuthState, setOnboardingStep } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
