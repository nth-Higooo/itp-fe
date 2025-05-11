import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from 'src/data/base-response.model';
import { TableFilterState } from 'src/redux/store';
import { DELETE, GET, POST, PUT } from '../axios';
import {
  EmployeeSkillRequest,
  EmployeeSkillResponse,
  SkillType,
  SkillTypesResponse,
} from 'src/data/skill/skill.model';

//----------------------API Employee Skill---------------------//
export const getEmployeeSkillsAsync = createAsyncThunk(
  'skills/getEmployeeSkillsAsync',
  async ({ id }: { id: string; params: TableFilterState }) => {
    const response: AxiosResponse<BaseResponse<EmployeeSkillResponse>> = await GET(
      `/skills?employeeId=${id}`
    );
    return response.data.data;
  }
);

export const addEmployeeSkillAsync = createAsyncThunk(
  'skills/addEmployeeSkillAsync',
  async (request: EmployeeSkillRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeeSkillResponse>> = await POST(
      '/skills',
      request
    );
    return response.data.data.skills;
  }
);

export const updateEmployeeSkillAsync = createAsyncThunk(
  'skills/updateEmployeeSkillAsync',
  async (request: EmployeeSkillRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeeSkillResponse>> = await PUT(
      `/skills/${request.id}`,
      request
    );
    return response.data.data.skills;
  }
);

export const deleteEmployeeSkillAsync = createAsyncThunk(
  'skills/deleteEmployeeSkillAsync',
  async (skillId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(`/skills/${skillId}`);
    return response.data.data;
  }
);

//----------------------API Skill Type---------------------//
export const getSkillTypeAsync = createAsyncThunk(
  'skill/getSkillTypeAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<SkillTypesResponse>> = await GET('/skill-types', {
      params,
    });
    return response.data.data;
  }
);

export const addSkillTypeAsync = createAsyncThunk(
  'skill/addSkillTypeAsync',
  async (request: SkillType) => {
    const response: AxiosResponse<BaseResponse<SkillType>> = await POST('/skill-types', request);
    return response.data.data;
  }
);

export const updateSkillTypeParentAsync = createAsyncThunk(
  'skill/updateLeaveTypeAsync',
  async (request: SkillType) => {
    const response: AxiosResponse<BaseResponse<SkillTypesResponse>> = await PUT(
      `/skill-types/${request.id}`,
      request
    );
    return response.data.data.skillTypes;
  }
);

export const updateSkillTypeChildAsync = createAsyncThunk(
  'skill/updateLeaveTypeAsync',
  async (request: SkillType) => {
    const response: AxiosResponse<BaseResponse<SkillTypesResponse>> = await PUT(
      `/skill-types/child/${request.id}`,
      request
    );
    return response.data.data;
  }
);

export const deleteSkillTypeAsync = createAsyncThunk(
  'skill/deleteSkillTypeAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string>> = await DELETE(`/skill-types/${id}`);
    return response.data.data;
  }
);
