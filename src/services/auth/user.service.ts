import { createAsyncThunk } from '@reduxjs/toolkit';

import { AxiosResponse } from 'axios';

import { DELETE, GET, POST, PUT } from '../axios';
import { BaseResponse } from '../../data/base-response.model';
import {
  CountUserSeparateStatusResponse,
  UserRequest,
  UserResponse,
  UsersResponse,
} from '../../data/auth/user.model';
import { TableFilterState } from '../../redux/store';

export const getUserByIdAsync = createAsyncThunk(
  'users/getUserByIdAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<UserResponse>> = await GET(`/users/${userId}`);

    return response.data.data;
  }
);

export const countUserSeparatedStatusAsync = createAsyncThunk(
  'users/countUserSeparatedStatusAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<CountUserSeparateStatusResponse>> =
      await GET('/users/count-all-status');
    return response.data.data;
  }
);

export const getUsersAsync = createAsyncThunk(
  'users/getUsersAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<UsersResponse>> = await GET('/users', {
      params,
    });
    return response.data.data;
  }
);

export const addUserAsync = createAsyncThunk('users/addUserAsync', async (request: UserRequest) => {
  const response: AxiosResponse<BaseResponse<UserResponse>> = await POST('/users', request);

  return response.data.data.user;
});

export const updateUserAsync = createAsyncThunk(
  'users/updateUserAsync',
  async (request: UserRequest) => {
    const response: AxiosResponse<BaseResponse<UserResponse>> = await PUT(
      `/users/${request.id}`,
      request
    );

    return response.data.data.user;
  }
);

export const deleteUserAsync = createAsyncThunk('users/deleteUserAsync', async (userId: string) => {
  const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(`/users/${userId}`);

  return response.data.data ?? userId;
});

export const restoreUserAsync = createAsyncThunk(
  'users/restoreUserAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await PUT(
      `/users/${userId}/restore`,
      {}
    );

    return response.data.data ?? userId;
  }
);

export const permanentlyDeleteUserAsync = createAsyncThunk(
  'users/permanentlyDeleteUserAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/users/${userId}/permanently`
    );

    return response.data.data ?? userId;
  }
);

export const resendEmailSetPasswordAsync = createAsyncThunk(
  'users/resendEmailSetPasswordAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await GET(
      `/users/${userId}/resend-email`
    );

    return response.data;
  }
);
export const uploadUserImage = createAsyncThunk(
  'users/uploadImage',
  async (avatar : string) => {
    const response: AxiosResponse<BaseResponse<UserResponse>> = await POST('/me', {
      avatar: avatar
    });
    return response.data.data;
  }
)
