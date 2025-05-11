import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  leaveRequestForm,
  LeaveRequestOfEmployee,
  LeaveRequestOfEmployeeRequest,
  EmployeeLeaveRequest,
  LeaveType,
  LeaveTypeResponse,
  LeaveTypesOfEmployeeResponse,
  EmployeeLeaveRequestResponse,
  LeaveInformationResponse,
  approveLeave,
  approveLeaveResponse,
  LeaveRequestFilterState,
  singleLeaveResponse,
  RemainingLeaveUpdate,
} from '../../data/leave/leave.model';
import { BaseResponse } from '../../data/base-response.model';
import { AxiosResponse } from 'axios';
import { DELETE, DOWNLOAD, GET, POST, PUT } from '../axios';
import { TableFilterState } from 'src/redux/store';
import { generateFileName } from 'src/utils/helper';

//------------------------Leave Type------------------------//

export const getLeaveTypeAsync = createAsyncThunk('leave/getLeaveTypeAsync', async ( params : TableFilterState ) => {
  const response: AxiosResponse<BaseResponse<LeaveTypeResponse>> = await GET('/leave-types');
  return response.data.data;
});

export const addLeaveTypeAsync = createAsyncThunk(
  'leave/addLeaveTypeAsync',
  async (request: LeaveType) => {
    const response: AxiosResponse<BaseResponse<LeaveType>> = await POST('/leave-types', request);
    return response.data.data;
  }
);

export const updateLeaveTypeAsync = createAsyncThunk(
  'leave/updateLeaveTypeAsync',
  async (request: LeaveType) => {
    const response: AxiosResponse<BaseResponse<LeaveType>> = await PUT(
      `/leave-types/${request.id}`,
      request
    );
    return response.data.data;
  }
);

export const deleteLeaveTypeAsync = createAsyncThunk(
  'leave/deleteLeaveTypeAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string>> = await DELETE(`/leave-types/${id}`);
    return response.data.data;
  }
);

//------------------------Leave Request Employer------------------------//

export const getLeaveRequestByEmployerAsync = createAsyncThunk(
  'leave-request/getLeaveRequestByEmployerAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<EmployeeLeaveRequestResponse>> = await GET(
      '/leave-requests',
      { params }
    );
    return response.data.data;
  }
);

//------------------------Leave Request Employee------------------------//

export const getLeaveTypeOfEmployeeAsync = createAsyncThunk(
  'leave/getLeaveTypeOfEmployeeAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<LeaveTypesOfEmployeeResponse>> = await GET(
      `/leave-types/employee/${id}`
    );
    return response.data.data;
  }
);
export const requestToApproveLeaveAsync = createAsyncThunk(
  'leave/requestToApproveLeaveAsync',
  async (data: leaveRequestForm) => {
    const response: AxiosResponse<BaseResponse<EmployeeLeaveRequest>> = await POST(
      `/leave-requests`,
      data
    );
    return response.data.data;
  }
);
export const getLeaveRequestListOfEmployeeAsync = createAsyncThunk(
  'leave/getLeaveRequestListOfEmployeeAsync',
  async (data: LeaveRequestOfEmployeeRequest) => {
    const response: AxiosResponse<BaseResponse<LeaveRequestOfEmployee>> = await GET(
      `/leave-requests/me`,
      {
        params: data,
      }
    );
    return response.data.data;
  }
);
export const deleteLeaveRequestAsync = createAsyncThunk(
  'leave/deleteLeaveRequestAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string>> = await DELETE(`/leave-requests/${id}`);
    return response.data.message;
  }
);

//--------------------------Leave Information By Employer-------------------------//

export const getLeaveInformationAsync = createAsyncThunk(
  'leave-request/getLeaveInformationAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<LeaveInformationResponse>> = await GET(
      '/leave-requests/leave-information',
      {
        params,
      }
    );
    return response.data.data;
  }
);

//--------------------------Leave Request by Approver----------------------//
export const getLeaveRequestApproverAsync = createAsyncThunk(
  'leave-request/getLeaveRequestApproverAsync',
  async (params: LeaveRequestFilterState) => {
    const response: AxiosResponse<BaseResponse<approveLeaveResponse>> = await GET(
      '/leave-requests/approval',
      {
        params,
      }
    );
    return response.data.data;
  }
);

export const updateLeaveRequestApproverAsync = createAsyncThunk(
  'leave-request/updateLeaveRequestApproverAsync',
  async (request: approveLeave) => {
    const response: AxiosResponse<BaseResponse<approveLeave>> = await PUT(
      `/leave-requests/${request.id}`,
      request
    );
    return response.data.data;
  }
);

export const getLeaveRequestByIdAsync = createAsyncThunk(
  'leave-request/getLeaveRequestByIdAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<singleLeaveResponse>> = await GET(
      `/leave-requests/${id}`
    );
    return response.data.data;
  }
);

//-----------------------Leave Request by Manager-----------------------------//
export const getLeaveRequestManagerAsync = createAsyncThunk(
  'manage/getLeaveRequestManagerAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<approveLeaveResponse>> = await GET(
      '/leave-requests/manager',
      {
        params,
      }
    );
    return response.data.data;
  }
);
export const exportLeaveRequestEmployerAsync = createAsyncThunk(
  'leave/exportLeaveRequestEmployerAsync',
  async (params: LeaveRequestOfEmployeeRequest) => {
    const response = await DOWNLOAD('/leave-requests/export-excel', {
      params,
    })
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    // Set the download attribute with the file name
    link.href = url;
    link.setAttribute("download",generateFileName("Leave_Request",true,"xlsx")); // Set the desired file name

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup: remove the link element after the download starts
    link.parentNode?.removeChild(link);

   return response.data;
  }
);

export const updateEmployeeRemainingAnnualLeaveAsync = createAsyncThunk(
  'leave/updateEmployeeRemainingAnnualLeaveAsync',
  async ({ id, params }: { id: string; params: RemainingLeaveUpdate }) => {
    const response: AxiosResponse<BaseResponse<string>> = await PUT(
      `/leave-types/employee/${id}`, params
    );
    return response.data.data;
  }
)
