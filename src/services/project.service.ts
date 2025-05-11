import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from 'src/data/base-response.model';
import {
  CountProjectSeparateStatusResponse,
  ProjectRequest,
  ProjectResponse,
  ProjectsResponse,
} from 'src/data/project';
import { DELETE, GET, POST, PUT } from './axios';
import { TableFilterState } from 'src/redux/store';

export const getProjectsAsync = createAsyncThunk(
  'projects/getProjectsAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<ProjectsResponse>> = await GET(`/projects`, {
      params,
    });

    return response.data.data;
  }
);

export const countProjectSeparatedStatusAsync = createAsyncThunk(
  'projects/countProjectSeparatedStatusAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<CountProjectSeparateStatusResponse>> = await GET(
      '/projects/count-all-status'
    );
    return response.data.data;
  }
);

export const addProjectAsync = createAsyncThunk(
  'projects/addProjectAsync',
  async (request: ProjectRequest) => {
    const response: AxiosResponse<BaseResponse<ProjectResponse>> = await POST('/projects', request);

    return response.data.data.project;
  }
);

export const updateProjectAsync = createAsyncThunk(
  'projects/updateProjectAsync',
  async (request: ProjectRequest) => {
    const response: AxiosResponse<BaseResponse<ProjectResponse>> = await PUT(
      `/projects/${request.id}`,
      request
    );

    return response.data.data.project;
  }
);

export const deleteProjectAsync = createAsyncThunk(
  'projects/deleteProjectAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/projects/${userId}`
    );

    return response.data.data ?? userId;
  }
);

export const restoreProjectAsync = createAsyncThunk(
  'projects/restoreProjectAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await PUT(
      `/projects/${userId}/restore`,
      {}
    );

    return response.data.data ?? userId;
  }
);

export const permanentlyDeleteProjectAsync = createAsyncThunk(
  'projects/permanentlyDeleteProjectAsync',
  async (userId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/projects/${userId}/permanently`
    );

    return response.data.data ?? userId;
  }
);
