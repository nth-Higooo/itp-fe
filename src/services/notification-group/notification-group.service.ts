import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from 'src/data/base-response.model';
import {
  CountProjectSeparateStatusResponse,
  ProjectRequest,
  ProjectResponse,
  ProjectsResponse,
} from 'src/data/project';
import { TableFilterState } from 'src/redux/store';
import { DELETE, GET, POST, PUT } from '../axios';
import {
  NotificationGroupMember,
  NotificationGroupMemberResponse,
  NotificationGroupResponse,
  NotificationGroupsResponse,
} from 'src/data/notification-group/notification-group.model';

export const getNotificationGroupsAsync = createAsyncThunk(
  'notificationGroup/getNotificationGroupsAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<NotificationGroupsResponse>> = await GET(
      `/group-notifications`,
      {
        params,
      }
    );

    return response.data.data;
  }
);

export const getNotificationGroupMembersAsync = createAsyncThunk(
  'notificationGroup/getNotificationGroupMembersAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<NotificationGroupMemberResponse>> = await GET(
      '/employees/notification-group-members'
    );
    return response.data.data.members;
  }
);

export const countProjectSeparatedStatusAsync = createAsyncThunk(
  'notificationGroup/countProjectSeparatedStatusAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<CountProjectSeparateStatusResponse>> = await GET(
      '/projects/count-all-status'
    );
    return response.data.data;
  }
);

export const addNotificationGroupAsync = createAsyncThunk(
  'notificationGroup/addNotificationGroupAsync',
  async (request: ProjectRequest) => {
    const response: AxiosResponse<BaseResponse<NotificationGroupResponse>> = await POST(
      '/group-notifications',
      request
    );

    return response.data.data.NotificationGroup;
  }
);

export const updateNotificationGroupAsync = createAsyncThunk(
  'notificationGroup/updateNotificationGroupAsync',
  async (request: ProjectRequest) => {
    const response: AxiosResponse<BaseResponse<NotificationGroupResponse>> = await PUT(
      `/group-notifications/${request.id}`,
      request
    );

    return response.data.data.NotificationGroup;
  }
);

export const deleteNotificationGroupAsync = createAsyncThunk(
  'notificationGroup/deleteNotificationGroupAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/group-notifications/${id}`
    );

    return response.data.data ?? id;
  }
);

export const restoreNotificationGroupAsync = createAsyncThunk(
  'notificationGroup/restoreNotificationGroupAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await PUT(
      `/projects/${id}/restore`,
      {}
    );

    return response.data.data ?? id;
  }
);

export const permanentlyDeleteNotificationGroupAsync = createAsyncThunk(
  'notificationGroup/permanentlyDeleteNotificationGroupAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/group-notifications/${id}/permanently`
    );

    return response.data.data ?? id;
  }
);
