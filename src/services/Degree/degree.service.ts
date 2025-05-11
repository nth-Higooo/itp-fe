import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from 'src/data/base-response.model';
import { Degree, DegreeResponse, DegreesResponse } from 'src/data/employee/employee.model';
import { TableFilterState } from 'src/redux/store';
import { DELETE, GET, POST, PUT } from '../axios';

export const getDegreesAsync = createAsyncThunk(
  'degree/getDegreesAsync',
  async (params?: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<DegreesResponse>> = await GET('/degrees', {
      params,
    });
    return response.data.data;
  }
);

export const addDegreeAsync = createAsyncThunk('degree/addDegreeAsync', async (request: Degree) => {
  const response: AxiosResponse<BaseResponse<DegreeResponse>> = await POST('/degrees', request);
  return response.data.data;
});

export const updateDegreeAsync = createAsyncThunk(
  'degree/updateDegreeAsync',
  async (request: Degree) => {
    const response: AxiosResponse<BaseResponse<DegreeResponse>> = await PUT(
      `/degrees/${request.id}`,
      request
    );
    return response.data.data.degree;
  }
);

export const deleteDegreeAsync = createAsyncThunk(
  'degree/deleteDegreeAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string>> = await DELETE(`/degrees/${id}`);
    return response.data.data;
  }
);
