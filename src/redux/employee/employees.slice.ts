import { Approver, EmployeeEducations, EmployeeStatus } from './../../data/employee/employee.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, StateStatus, TableFilterState } from '../store';
import { Employee } from '../../data/employee/employee.model';
import {
  initBankInfo,
  initDetailInfo,
  initEmergencyContact,
  initGeneralInfo,
  initGovernmentInfo,
  initOthersInfo,
  initSalary,
} from '../onboarding/onboarding.slice';
import { Department } from '../../data/employer/department.model';
import { Position } from '../../data/employer/position.model';
import {
  EmployeeChangeRequest,
  initBenefit,
  OnboardingEmployee,
} from 'src/data/employee/onboarding.model';
import { EmployeeSkill } from 'src/data/skill/skill.model';
import { getEmployeeSkillsAsync } from 'src/services/skill/skill.service';
import {
  countEmployeesAllStatusAsync,
  deleteEmployeesAsync,
  getEmployeeByIdAsync,
  getEmployeeByManagerAsync,
  getEmployeeEducationsAsync,
  getEmployeeInfoAsync,
  getEmployeesAsync,
  getEmployeesWithDepartmentsAsync,
  getListApproverAsync,
  importCsvFileAsync,
  importExcelFileAsync,
  updateEmployeeAsync,
} from 'src/services/employee/employee.service';

export type EmployeeFilterType = TableFilterState & {
  department: Department;
  position: Position;
  search: string;
  sortBy?: string;
  orderBy?: string;
  employeeStatus?: string;
};

export type EmployeeFilter = TableFilterState & {
  departmentId: string;
  positionId: string;
  employeeStatus?: string;
  search: string;
  sortBy?: string;
  orderBy?: string;
};

export const initEmployeeChangeRequest: EmployeeChangeRequest = {
  ...initBankInfo,
  ...initGovernmentInfo,
  ...initEmergencyContact,
  ...initDetailInfo,
  ...initOthersInfo,
};

export type EmployeeState = {
  getEmployeeStatus: StateStatus;
  addEmployeeStatus: StateStatus;
  updateEmployeeStatus: StateStatus;
  deleteEmployeeStatus: StateStatus;
  employeeList: Employee[];
  skillList: EmployeeSkill[];
  educationsList: EmployeeEducations[];
  employeeListByManager: Employee[];
  total: number;
  selectedEmpIds: string[];
  selectedOneEmployee: Employee;
  detailEmployee: OnboardingEmployee;
  employeeFilter: EmployeeFilterType;
  employeeFilterString: EmployeeFilter;
  error: string | null;
  isLoading: boolean;
  countAllStatus: {
    total: number;
    totalActive: number;
    totalResign: number;
    totalNoContract: number;
    totalDeleted: number;
  };
  employeeRequestChange: EmployeeChangeRequest;
  approvers?: Approver[];
  count: number;
};

export const initEmployeeFilter: EmployeeFilterType = {
  pageIndex: 1,
  pageSize: 100,
  // sortField: 'id',
  // orderBy: 'asc',
  orderBy: 'asc',
  department: { id: '', name: '' } as Department,
  position: { id: '', name: '' } as Position,
  search: '',
  sortBy: 'name',
};

export const initEmployee: Employee = {
  userId: '',
  id: '',
  email: '',
  fullName: '',
  photo: '',
  departments: [],
  position: {
    id: '',
    name: '',
    level: '',
    orderNumber: 0,
    parentId: '',
    levels: [],
  },
  contracts: [],
  status: {} as EmployeeStatus,
  createdAt: '',
  resetToken: '',
  roles: [],
  bankAccount: {
    bankName: '',
    bankBranch: '',
    bankAccountName: '',
    bankAccountNumber: '',
  },
  positionId: '',
  departmentIds: [],
  skills: [],
  educations: [],
};

export const initEmployeeDetail: OnboardingEmployee = {
  ...initEmployee,
  ...initGeneralInfo,
  ...initEmployeeChangeRequest,
  ...initSalary,
  ...initBenefit,
  changedInformation: initEmployeeChangeRequest,
  departmentIds: [],
  recommendedRoleIds: [],
  positionId: '',
};

export const initEmployeeState: EmployeeState = {
  employeeList: [],
  addEmployeeStatus: 'idle',
  getEmployeeStatus: 'idle',
  total: 0,
  deleteEmployeeStatus: 'idle',
  selectedOneEmployee: initEmployee,
  updateEmployeeStatus: 'idle',
  selectedEmpIds: [],
  employeeFilter: initEmployeeFilter,
  error: '',
  detailEmployee: initEmployeeDetail,
  employeeFilterString: {
    pageIndex: 1,
    pageSize: 100,
    // sortField: 'id',
    orderBy: 'asc',
    departmentId: '',
    positionId: '',
    search: '',
    sortBy: 'name',
  },
  isLoading: true,
  countAllStatus: {
    total: 0,
    totalActive: 0,
    totalResign: 0,
    totalNoContract: 0,
    totalDeleted: 0,
  },
  employeeRequestChange: initEmployeeChangeRequest,
  employeeListByManager: [],
  count: 0,
  skillList: [],
  educationsList: [],
};

export const employeeSlice = createSlice({
  name: 'employees',
  initialState: initEmployeeState,
  reducers: {
    saveEmployee: (state, action: PayloadAction<EmployeeState>) => {
      state.employeeList = action.payload.employeeList;
    },
    resetEmployeesState: (state) => {
      state = initEmployeeState;
      return state;
    },
    selectEmployeeIds: (state, action: PayloadAction<string[]>) => {
      state.selectedEmpIds = [...action.payload];
    },
    setEmployeeTableFilter: (state, action: PayloadAction<EmployeeFilterType>) => {
      state.employeeFilter = action.payload;
      state.employeeFilterString = {
        ...state.employeeFilterString,
        departmentId: action.payload.department.id,
        positionId: action.payload.position.id,
        search: action.payload.search,
        pageIndex: action.payload.pageIndex,
        pageSize: action.payload.pageSize,
        // sortField: action.payload.sortField,
        orderBy: action.payload.orderBy,
        sortBy: action.payload.sortBy,
      };
    },
    setSelectOneEmployee: (state, action: PayloadAction<Employee>) => {
      state.selectedOneEmployee = action.payload;
    },
    setDetailEmployee: (state, action: PayloadAction<OnboardingEmployee>) => {
      state.detailEmployee = action.payload;
    },
    setEmployeeRequestChange: (state, action) => {
      state.employeeRequestChange = { ...state.employeeRequestChange, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeesAsync.fulfilled, (state, action) => {
        state.employeeList = action.payload.employees;
        state.total = action.payload.count;
        state.isLoading = false;
      })
      .addCase(deleteEmployeesAsync.fulfilled, (state, action) => {
        state.employeeList = state.employeeList.filter((u) => u.id !== action.payload);
      })
      .addCase(getEmployeeByIdAsync.fulfilled, (state, action) => {
        state.selectedOneEmployee = action.payload;
      })
      .addCase(getEmployeeInfoAsync.fulfilled, (state, action) => {
        state.detailEmployee = action.payload;
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        state.detailEmployee = action.payload;
      })
      .addCase(getEmployeesWithDepartmentsAsync.fulfilled, (state, action) => {
        state.employeeList = action.payload.employees;
        state.total = action.payload.count;
        state.employeeFilter.pageSize = action.payload.pageSize;
        state.employeeFilter.pageIndex = action.payload.pageIndex;
        state.isLoading = false;
      })
      .addCase(countEmployeesAllStatusAsync.fulfilled, (state, action) => {
        state.countAllStatus = action.payload as any;
      })
      .addCase(getListApproverAsync.fulfilled, (state, action) => {
        state.approvers = action.payload;
      })
      .addCase(getEmployeeByManagerAsync.fulfilled, (state, action) => {
        state.employeeListByManager = action.payload.employees;
        state.total = action.payload.count;
      })

      .addCase(getEmployeeSkillsAsync.fulfilled, (state, action) => {
        state.skillList = action.payload.skills;
        state.count = action.payload.count;
      })
      .addCase(getEmployeeEducationsAsync.fulfilled, (state, action) => {
        state.educationsList = action.payload.educations;
      })

      .addCase(importExcelFileAsync.fulfilled, (state) => {
        state.employeeList.length += 1;
      })
      .addCase(importCsvFileAsync.fulfilled, (state) => {
        state.employeeList.length += 1;
      });
  },
});

export const {
  saveEmployee,
  resetEmployeesState,
  selectEmployeeIds,
  setEmployeeTableFilter,
  setSelectOneEmployee,
  setEmployeeRequestChange,
} = employeeSlice.actions;

export const selectEmployees = (state: RootState) => state.employees;

export default employeeSlice.reducer;
