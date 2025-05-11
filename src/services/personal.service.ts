import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { RolesResponse } from 'src/data/auth/role.model';
import { BaseResponse } from 'src/data/base-response.model';
import { POST } from './axios';
import { ChangePasswordRequest } from 'src/data/personal';

export const changePasswordAsync = createAsyncThunk(
  'personal/changePasswordAsync',
  async (payload: ChangePasswordRequest) => {
    const response: AxiosResponse<BaseResponse<RolesResponse>> = await POST(
      '/change-password',
      payload
    );
    return response.data.data;
  }
);
