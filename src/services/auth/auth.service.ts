import { AxiosResponse } from 'axios';
import { GET, POST } from '../axios';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
} from '../../data/auth/auth.model';
import { BaseResponse } from '../../data/base-response.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import TokenService, { rememberMeKey, sessionKey, setRememberMe } from '../token.service';
import { UserResponse } from '../../data/auth/user.model';
import { STORAGE_KEY } from 'src/components/settings';
import { schemeConfig } from 'src/theme/scheme-config';

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (signInRequest: SignInRequest) => {
    const response: AxiosResponse<BaseResponse<UserResponse>> = await POST('/login', signInRequest);

    TokenService.setSession(response.data.session);

    setRememberMe(signInRequest.rememberMe);

    return response.data.data.user;
  }
);

export const getCurrentUserAsync = createAsyncThunk('auth/getCurrentUserAsync', async () => {
  const response: AxiosResponse<BaseResponse<UserResponse>> = await GET(`/me`);

  TokenService.setSession(response.data.session);
  //

  return response.data.data;
});

export const forgotPasswordAsync = async (forgotPasswordRequest: ForgotPasswordRequest) => {
  const response: AxiosResponse<BaseResponse<string | null>> = await POST(
    '/forgot-password',
    forgotPasswordRequest
  );

  return response.data;
};

export const resetPasswordAsync = async (resetPasswordRequest: ResetPasswordRequest) => {
  const response: AxiosResponse<BaseResponse<string | null>> = await POST(
    '/new-password',
    resetPasswordRequest
  );

  TokenService.setSession(response.data.session);

  return response.data;
};

export const refreshTokenAsync = async () => {
  const response: AxiosResponse<BaseResponse<string | null>> = await POST('/refresh', {});
  return response.data;
};

export const doLogout = () => {
  TokenService.deleteItem(sessionKey);
  TokenService.deleteItem(rememberMeKey);
  // reset theme
  TokenService.deleteItem(STORAGE_KEY);
  TokenService.deleteItem(schemeConfig.modeStorageKey);
};
