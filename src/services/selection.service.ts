import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from '../data/base-response.model';
import { RolesResponse } from '../data/auth/role.model';
import { GET } from './axios';
import { DepartmentsResponse } from '../data/employer/department.model';
import {
  Position,
  PositionLevelsResponse,
  PositionsResponse,
} from '../data/employer/position.model';
import { EmployeesResponse, TimeKeeperResponse } from '../data/employee/employee.model';
import { LeaveTypeResponse } from 'src/data/leave/leave.model';
import { SkillTypesResponse } from 'src/data/skill/skill.model';

export const getAllRolesAsync = createAsyncThunk('selections/getAllRolesAsync', async () => {
  const response: AxiosResponse<BaseResponse<RolesResponse>> = await GET('/roles');
  return response.data.data;
});

export const getAllEmployeesAsync = createAsyncThunk(
  'selections/getAllEmployeesAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<EmployeesResponse>> = await GET('/employees');
    return response.data.data;
  }
);

export const getAllDepartmentsAsync = createAsyncThunk(
  '/selections/getAllDepartmentsAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<DepartmentsResponse>> = await GET('/departments');
    return response.data.data.departments;
  }
);

export const getAllPositionsLevels = createAsyncThunk(
  '/selections/getAllPositionsLevels',
  async () => {
    const response: AxiosResponse<BaseResponse<PositionsResponse>> = await GET(`/positions`);
    return response.data.data.positions;
  }
);

export const getAllLeaveTypeAsync = createAsyncThunk(
  'selections/getAllLeaveTypeAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<LeaveTypeResponse>> = await GET(
      'leave-types?pageSize=10000'
    );
    return response.data.data;
  }
);

export const getAllPositionsWithLevels = createAsyncThunk(
  '/selections/getAllPositionsWithLevels',
  async () => {
    const response: AxiosResponse<BaseResponse<PositionLevelsResponse>> =
      await GET(`/positions?isFilter=true`);
    return response.data.data.position_levels;
  }
);

export const getAllSkillTypeAsync = createAsyncThunk(
  'selections/getAllSkillTypeAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<SkillTypesResponse>> = await GET(
      'skill-types?pageSize=10000'
    );
    return response.data.data;
  }
);

export const getTimeKeeperUsersAsync = createAsyncThunk(
  'timekeeper/getTimeKeeperUsersAsync',
  async () => {
    const response: AxiosResponse<BaseResponse<TimeKeeperResponse>> =
      await GET('/timekeepers/users');

    return response.data;
  }
);
