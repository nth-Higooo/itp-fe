import { EmployeeFilter } from '../../redux/employee/employees.slice';

import { TableFilterState } from '../../redux/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AxiosResponse } from 'axios';
import { DELETE, DOWNLOAD, GET, POST, PUT } from '../axios';
import { BaseResponse } from '../../data/base-response.model';
import {
  ApproverResponse,
  bankAccount,
  EmployeeCountRequest,
  EmployeeEducations,
  EmployeeEducationsResponse,
  EmployeeResponse,
  EmployeesResponse,
  EmpResponse,
} from '../../data/employee/employee.model';
import {
  EmployeeChangeRequest,
  EmployeeChangeResponse,
  EmployeeCreateRequest,
  OnboardingEmployee,
} from 'src/data/employee/onboarding.model';
import { generateFileName } from 'src/utils/helper';
import {
  EmployeeSkill,
  EmployeeSkillRequest,
  EmployeeSkillResponse,
} from 'src/data/skill/skill.model';

export const getEmployeeByIdAsync = createAsyncThunk(
  'employees/getEmployeeByIdAsync',
  async (employeeId: string) => {
    const response: AxiosResponse<BaseResponse<EmployeeResponse>> = await GET(
      `/employees/${employeeId}`
    );
    return response.data.data.employee;
  }
);

export const getEmployeeInfoAsync = createAsyncThunk(
  'employees/getEmployeeInfoAsync',
  async (employeeId: string) => {
    const response: AxiosResponse<BaseResponse<EmpResponse>> = await GET(
      `/employees/${employeeId}`
    );

    return response.data.data.employee;
  }
);

export const getEmployeesAsync = createAsyncThunk(
  'employees/getEmployeesAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<EmployeesResponse>> = await GET('/employees', {
      params,
    });
    return response.data.data;
  }
);

export const getEmployeeByManagerAsync = createAsyncThunk(
  'manage/getEmployeeByManagerAsync',
  async (params: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<EmployeesResponse>> = await GET(
      '/employees/manager',
      {
        params,
      }
    );
    return response.data.data;
  }
);

export const addEmployeeAsync = createAsyncThunk(
  'employees/addEmployeeAsync',
  async (request: EmployeeCreateRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeeResponse>> = await POST(
      '/employees',
      request
    );
    return response.data.data.employee.id;
  }
);

export const updateEmployeeAsync = createAsyncThunk(
  'employees/updateEmployeeAsync',
  async (request: any) => {
    const response: AxiosResponse<BaseResponse<EmpResponse>> = await PUT(
      `/employees/${request.id}`,
      request
    );
    return response.data.data.employee;
  }
);

export const updateBankAsync = createAsyncThunk(
  'employees/updateBankAsync',
  async (request: bankAccount) => {
    const response: AxiosResponse<BaseResponse<EmployeeResponse>> = await PUT(
      `/employees/${request.id}/bank-account`,
      request
    );
    return response.data.data;
  }
);

export const deleteEmployeesAsync = createAsyncThunk(
  'employees/deleteEmpAsync',
  async (empId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/employees/${empId}`
    );
    return response.data.data;
  }
);

export const permanentlyDeleteEmployeesAsync = createAsyncThunk(
  'employees/permanentlyDeleteEmpAsync',
  async (empId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(
      `/employees/${empId}/permanently`
    );
    return response.data.data;
  }
);

export const uploadImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response: AxiosResponse = await POST(`/medias/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.url;
};

export const getEmployeesWithDepartmentsAsync = createAsyncThunk(
  'employees/getEmployeesWithDepartmentsAsync',
  async (params: EmployeeFilter) => {
    const response: AxiosResponse<BaseResponse<EmployeesResponse>> = await GET(`/employees`, {
      params,
    });
    return response.data.data;
  }
);
export const importCsvFileAsync = createAsyncThunk(
  'employees/importCsvFileAsync',
  async (file: File) => {
    const formData = new FormData();
    formData.append('csv-file', file);
    const response: AxiosResponse = await POST(`/employees/upload-csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status;
  }
);
export const importExcelFileAsync = createAsyncThunk(
  'employees/importExcelFileAsync',
  async (file: File) => {
    const formData = new FormData();
    formData.append('excel-file', file);
    const response: AxiosResponse = await POST(`/employees/upload-excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status;
  }
);

export const countEmployeesAllStatusAsync = createAsyncThunk(
  'employees/countEmployeesAllStatusAsync',
  async (filter: EmployeeCountRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeesResponse>> = await GET(
      `/employees/count-all-status`,
      { params: filter }
    );
    return response.data.data;
  }
);

export const restoreEmployeesAsync = createAsyncThunk(
  'employees/restoreEmployeesAsync',
  async (empId: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await PUT(
      `/employees/${empId}/restore`,
      {}
    );
    return response.data.data;
  }
);
export const getListApproverAsync = createAsyncThunk('employees/getListApproverAsync', async () => {
  const response: AxiosResponse<BaseResponse<ApproverResponse>> = await GET('/employees/approvers');
  return response.data.data.approvers;
});

export const changeRequestAsync = createAsyncThunk(
  'employees/changeRequestAsync',
  async (request: EmployeeChangeRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeeChangeResponse>> = await POST(
      '/employees/change-request',
      request
    );
    return response.data.data.changedInformation;
  }
);

export const approveChangeRequestAsync = createAsyncThunk(
  'employees/approveChangeRequestAsync',
  async (request: EmployeeChangeRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeeResponse>> = await PUT(
      `/employees/${request.id}/change-request/Approve`,
      request
    );
    return response.data.data.employee;
  }
);

export const rejectChangeRequestAsync = createAsyncThunk(
  'employees/rejectChangeRequestAsync',
  async (request: EmployeeChangeRequest) => {
    const response: AxiosResponse<BaseResponse<EmployeeResponse>> = await PUT(
      `/employees/${request.id}/change-request/Reject`,
      request
    );
    return response.data.data.employee;
  }
);


export const resendEmailSetPasswordOfEmployeeAsync = createAsyncThunk(
  'employees/resendEmailSetPasswordOfEmployeeAsync',
  async (userIds: string[]) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await POST(
      `/employees/onboarding/email`,
        { userIds }
    );
    return response.data;
  }
);
export const exportEmployeesAsync = createAsyncThunk(
  'employees/exportEmployeesAsync',
  async (params: EmployeeFilter) => {
    const response = await DOWNLOAD('/employees/export-excel', {
      params,
    });
    // Create a URL for the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    // Set the download attribute with the file name
    link.href = url;
    link.setAttribute('download', generateFileName('employee', true, 'xlsx')); // Set the desired file name

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup: remove the link element after the download starts
    link.parentNode?.removeChild(link);

    return response.data;
  }
);

export const addEmployeeEducationsAsync = createAsyncThunk(
  'educations/addEmployeeEducationsAsync',
  async (request: EmployeeEducations) => {
    const response: AxiosResponse<BaseResponse<EmployeeEducationsResponse>> = await POST(
      '/educations',
      request
    );
    return response.data.data;
  }
);

export const getEmployeeEducationsAsync = createAsyncThunk(
  'educations/getEmployeeEducationsAsync',
  async ({ employeeId, type }: { employeeId: string; type: string }) => {
    const response: AxiosResponse<BaseResponse<EmployeeEducationsResponse>> = await GET(
      `/educations?employeeId=${employeeId}&type=${type}`
    );
    return response.data.data;
  }
);

export const updateEmployeeEducationsAsync = createAsyncThunk(
  'educations/updateEmployeeEducationsAsync',
  async (request: EmployeeEducations) => {
    const response: AxiosResponse<BaseResponse<EmployeeEducationsResponse>> = await PUT(
      `/educations/${request.id}`,
      request
    );
    return response.data.data;
  }
);

export const deleteEmployeeEducationsAsync = createAsyncThunk(
  'employees/deleteEmployeeEducationsAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string | null>> = await DELETE(`/educations/${id}`);
    return response.data.data;
  }
);
