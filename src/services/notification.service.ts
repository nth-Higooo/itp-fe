import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from 'src/data/base-response.model';
import { GET, POST } from './axios';
import { NotificationResponse } from 'src/data/personal';

export const getNotificationsByUserIdAsync = createAsyncThunk(
  'notification/getNotificationsByUserIdAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<NotificationResponse>> = await GET(
      `/notifications?userId=${userId}`
    );
    return response.data.data;
  }
);

export const readNotificationAsync = createAsyncThunk(
  'notification/readNotificationAsync',
  async (payload: string) => {
    const response: AxiosResponse<BaseResponse<any>> = await POST('/notifications/read', payload);
    return response.data.data;
  }
);

export const deleteNotificationAsync = createAsyncThunk(
  'notification/readNotificationAsync',
  async (payload: string) => {
    const response: AxiosResponse<BaseResponse<any>> = await POST('/notifications/delete', payload);
    return response.data.data;
  }
);
