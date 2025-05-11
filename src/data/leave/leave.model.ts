import { TableFilterState } from 'src/redux/store';
import { Approver, Employee } from '../employee/employee.model';
import { Department } from '../employer/department.model';
//--------------Leave Type--------------//
export type LeaveType = {
  id: string;
  name: string;
  regulationQuantity: number;
  orderNumber: number;
  updatedAt?: string;
};

export type LeaveTypeRequest = {
  name: string;
  regulationQuantity: number;
  orderNumber: number;
};

export type LeaveTypeResponse = {
  leaveTypes: LeaveType[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

//-------------Employer----------------//

export enum LeaveRequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export type EmployeeLeaveRequest = {
  id: string;
  result: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  numberOfDay?: number;
  comments?: string;
  status?: LeaveRequestStatus;
  employee: Employee;
  approver: Approver;
  updateAt?: string;
};

export type EmployeeLeaveRequestResponse = {
  leaveRequests: EmployeeLeaveRequest[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type LeaveTypeOfEmployee = LeaveType & {
  used: number;
  remaining: number;
};

export type LeaveTypesOfEmployeeResponse = {
  pageSize: number;
  pageIndex: number;
  count: number;
  results: LeaveTypeOfEmployee[];
};

export type leaveRequestForm = {
  leaveTypeId?: string;
  approverId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  numberOfDays?: number;
};

export type LeaveRequest = {
  id?: string;
  leaveType?: LeaveType;
  startDate?: Date;
  endDate?: Date;
  reason?: string;
  status?: string;
  approver?: Approver;
};

export type LeaveInformation = {
  id: string;
  fullName: string;
  departments?: Department[];
  remainingAnnualLeave: number | string;
  usedLeaves?: usedLeave[];
};

export type usedLeave = {
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  totalLeaveDays: number;
};

export type LeaveInformationResponse = {
  leaveInformation: LeaveInformation[];
  pageSize: number;
  pageIndex: number;
  count: number;
};
//--------Employee--------//
export type LeaveRequestOfEmployeeRequest = {
  pageSize: number;
  pageIndex: number;
  year: number;
  leaveTypeId: string;
};
export type LeaveRequestOfEmployeeResponse = EmployeeLeaveRequest & {
  numberOfDays: number;
  comment: string;
};
export type LeaveRequestOfEmployee = {
  pageSize: number;
  pageIndex: number;
  count: number;
  leaveRequests: LeaveRequestOfEmployeeResponse[];
};

//-------------Approver----------//
export type approveLeave = {
  id?: string;
  status: string;
  comment?: string;
};

export type approveLeaveResponse = {
  pageSize: number;
  pageIndex: number;
  count: number;
  leaveRequests: EmployeeLeaveRequest[];
};

export type singleLeaveResponse = {
  leaveRequests: EmployeeLeaveRequest;
}

export type LeaveRequestFilterState = TableFilterState & {
  leaveRequestId?: string;
}

export type RemainingLeaveUpdate = {
  quantity: number;
  year: number;
}

