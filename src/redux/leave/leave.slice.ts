import { createSlice } from '@reduxjs/toolkit';
import {
  EmployeeLeaveRequest,
  LeaveInformation,
  LeaveRequestOfEmployee,
  LeaveRequestStatus,
  LeaveType,
  LeaveTypeResponse,
  LeaveTypesOfEmployeeResponse,
  singleLeaveResponse,
} from '../../data/leave/leave.model';
import {
  deleteLeaveRequestAsync,
  getLeaveInformationAsync,
  getLeaveRequestApproverAsync,
  getLeaveRequestByEmployerAsync,
  getLeaveRequestByIdAsync,
  getLeaveRequestListOfEmployeeAsync,
  getLeaveRequestManagerAsync,
  getLeaveTypeAsync,
  getLeaveTypeOfEmployeeAsync,
} from '../../services/leave/leave.service';
import { RootState, StateStatus } from '../store';
import { initEmployee } from '../employee/employees.slice';
import { toast } from 'src/components/snackbar';

export const initLeaveType: LeaveType = {
  id: '',
  name: '',
  regulationQuantity: 0,
  orderNumber: 0,
  updatedAt: '',
};

export const initEmployeeLeaveRequest: EmployeeLeaveRequest = {
  id: '',
  result: initLeaveType,
  startDate: '',
  endDate: '',
  reason: '',
  numberOfDay: 0,
  status: LeaveRequestStatus.PENDING,
  employee: initEmployee,
  approver: initEmployee,
};

export type leaveState = {
  leaveTypeList: LeaveTypeResponse;
  selectedLeaveType?: LeaveType;
  selectedLeaveTypes: LeaveType[];
  selectedLeaveTypeIds: string[];
  leaveTypesOfEmployee?: LeaveTypesOfEmployeeResponse;
  leaveRequestListOfEmployee?: LeaveRequestOfEmployee;
  getLeaveRequestList: StateStatus;
  leaveRequestList: EmployeeLeaveRequest[];
  leaveRequestApprover: EmployeeLeaveRequest[];
  leaveRequestManager: EmployeeLeaveRequest[];
  leaveInformationList: LeaveInformation[];
  selectedLeaveRequest?: string;
  selectedLeaveRequestObject?: EmployeeLeaveRequest;
  count: number;
};

export const initLeaveState: leaveState = {
  leaveTypeList: {
    leaveTypes: [],
    pageSize: 5,
    pageIndex: 1,
    count: 0,
  },
  selectedLeaveType: undefined,
  selectedLeaveTypes: [],
  selectedLeaveTypeIds: [],
  getLeaveRequestList: 'idle',
  leaveRequestList: [],
  leaveInformationList: [],
  count: 0,
  leaveRequestApprover: [],
  selectedLeaveRequest: undefined,
  leaveRequestManager: [],
};

export const leaveSlice = createSlice({
  name: 'leave',
  initialState: initLeaveState,
  reducers: {
    selectLeaveId: (state, action) => {
      state.selectedLeaveRequest = action.payload;
    },
    resetLeaveRequestSelection: (state) => {
      state.selectedLeaveRequestObject = undefined;
    },
    setLeaveTypeList: (state, action) => {
      state.leaveTypeList = action.payload;
    },
    selectLeaveType: (state, action) => {
      state.selectedLeaveType = action.payload;
    },
    selectLeaveTypes: (state, action) => {
      state.selectedLeaveTypes = action.payload;
      state.selectedLeaveTypeIds = action.payload.map((leaveType: LeaveType) => leaveType.id);
    },
    resetLeaveTypeSelection: (state) => {
      state.selectedLeaveType = undefined;
      state.selectedLeaveTypes = [];
    },
    setLeaveRequestList: (state, action) => {
      state.leaveRequestList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLeaveTypeAsync.fulfilled, (state, action) => {
      state.leaveTypeList = action.payload;
    });
    builder.addCase(getLeaveRequestByEmployerAsync.fulfilled, (state, action) => {
      state.leaveRequestList = action.payload.leaveRequests;
      state.count = action.payload.count;
    });
    builder.addCase(getLeaveInformationAsync.fulfilled, (state, action) => {
      state.leaveInformationList = action.payload.leaveInformation;
      state.count = action.payload.count;
    });
    builder.addCase(getLeaveTypeOfEmployeeAsync.fulfilled, (state, action) => {
      state.leaveTypesOfEmployee = action.payload;
    });
    builder.addCase(getLeaveRequestListOfEmployeeAsync.fulfilled, (state, action) => {
      state.leaveRequestListOfEmployee = action.payload;
    });
    builder.addCase(deleteLeaveRequestAsync.fulfilled, (state, action) => {
      toast.success(action.payload);
    });
    builder.addCase(getLeaveRequestApproverAsync.fulfilled, (state, action) => {
      state.leaveRequestApprover = action.payload.leaveRequests;
      state.count = action.payload.count;
    });
    builder.addCase(getLeaveRequestManagerAsync.fulfilled, (state, action) => {
      state.leaveRequestManager = action.payload.leaveRequests;
      state.count = action.payload.count;
    });
    builder.addCase(getLeaveRequestByIdAsync.fulfilled, (state, action) => {
      state.selectedLeaveRequestObject = action.payload.leaveRequests;
    });
  },
});

export const {
  resetLeaveRequestSelection,
  selectLeaveId,
  setLeaveTypeList,
  selectLeaveType,
  selectLeaveTypes,
  resetLeaveTypeSelection,
  setLeaveRequestList,
} = leaveSlice.actions;

export const selectLeave = (state: RootState) => state.leave;

export default leaveSlice.reducer;
