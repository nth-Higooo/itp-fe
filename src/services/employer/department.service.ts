import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from '../../data/base-response.model';
import {
  DepartmentRequest,
  DepartmentResponse,
  DepartmentsResponse,
} from '../../data/employer/department.model';
import { TableFilterState } from '../../redux/store';
import { DELETE, GET, POST, PUT } from '../axios';

export const getDepartmentByIdAsync = createAsyncThunk(
  'departments/getDepartmentByIdAsync',
  async (departmentId: string) => {
    const response: AxiosResponse<BaseResponse<DepartmentResponse>> = await GET(
      `/departments/${departmentId}`
    );
    return response.data.data;
  }
);

export const getDepartmentsAsync = createAsyncThunk(
  'departments/getDepartmentsAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<DepartmentsResponse>> = await GET('/departments', {
      params,
    });
    return response.data.data;
  }
);

export const addDepartmentAsync = createAsyncThunk(
  'departments/addDepartment',
  async (request: DepartmentRequest) => {
    const response: AxiosResponse<BaseResponse<DepartmentResponse>> = await POST(
      '/departments',
      request
    );
    return response.data.data.department;
  }
);

export const updateDepartmentAsync = createAsyncThunk(
  'departments/updateDepartmentAsync',
  async (request: DepartmentRequest) => {
    const response: AxiosResponse<BaseResponse<DepartmentResponse>> = await PUT(
      `/departments/${request.id}`,
      request
    );
    return response.data.data.department;
  }
);

export const deleteDepartmentAsync = createAsyncThunk(
  'departments/deleteDepartmentAsync',
  async (departmentId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/departments/${departmentId}/permanently`
    );

    return response.data.data ?? departmentId;
  }
);
