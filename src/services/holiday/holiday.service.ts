import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from '../../data/base-response.model';
import { cloneYear, Holiday, HolidaysResponse } from '../../data/holiday/holiday.model';
import { DELETE, GET, POST, PUT } from '../axios';
import { TableFilterState } from '../../redux/store';

export const getHolidaysAsync = createAsyncThunk(
  'holiday/getHolidaysAsync',
  async (params?: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<HolidaysResponse>> = await GET('/holidays', {
      params,
    });
    return response.data.data;
  }
);

export const addHolidayAsync = createAsyncThunk(
  'holiday/addHolidayAsync',
  async (request: Holiday) => {
    const response: AxiosResponse<BaseResponse<Holiday>> = await POST('/holidays', request);
    return response.data.data;
  }
);

export const updateHolidayAsync = createAsyncThunk(
  'holiday/updateHolidayAsync',
  async (request: Holiday) => {
    const response: AxiosResponse<BaseResponse<Holiday>> = await PUT(
      `/holidays/${request.id}`,
      request
    );
    return response.data.data;
  }
);

export const deleteHolidayAsync = createAsyncThunk(
  'holiday/deleteHolidayAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string>> = await DELETE(`/holidays/${id}`);
    return response.data.data;
  }
);

export const cloneHolidayAsync = createAsyncThunk(
  'holiday/cloneHolidayAsync',
  async (request: cloneYear) => {
    const response: AxiosResponse<BaseResponse<Holiday>> = await POST('/holidays/clone', request);
    return response.data.data;
  }
);
