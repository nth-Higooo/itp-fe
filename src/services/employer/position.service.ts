import { createAsyncThunk } from '@reduxjs/toolkit';

import { AxiosResponse } from 'axios';

import { DELETE, GET, POST, PUT } from '../axios';
import { BaseResponse } from '../../data/base-response.model';

import { TableFilterState } from '../../redux/store';
import {
  PositionRequest,
  PositionResponse,
  PositionsResponse,
} from '../../data/employer/position.model';

export const getPositionByIdAsync = createAsyncThunk(
  'positions/getPositionByIdAsync',
  async (positionId: string) => {
    const response: AxiosResponse<BaseResponse<PositionResponse>> = await GET(
      `/positions/${positionId}`
    );

    return response.data.data;
  }
);

export const getPositionsAsync = createAsyncThunk(
  'positions/getPositionsAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<PositionsResponse>> = await GET('/positions', {
      params,
    });
    return response.data.data;
  }
);

export const addPositionAsync = createAsyncThunk(
  'positions/addPositionAsync',
  async (request: PositionRequest) => {
    const response: AxiosResponse<BaseResponse<PositionResponse>> = await POST(
      '/positions',
      request
    );

    return response.data.data.position;
  }
);

export const updatePositionAsync = createAsyncThunk(
  'positions/updatePositionAsync',
  async (request: PositionRequest) => {
    const response: AxiosResponse<BaseResponse<PositionResponse>> = await PUT(
      `/positions/${request.id}`,
      request
    );

    return response.data.data.position;
  }
);

export const deletePositionAsync = createAsyncThunk(
  'positions/deletePositionAsync',
  async (positionId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/positions/${positionId}/permanently`
    );

    return response.data.data ?? positionId;
  }
);
