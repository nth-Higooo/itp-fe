import { Role } from '../auth/role.model';
import { Contract } from '../contract';
import { Department } from '../employer/department.model';
import { Position } from '../employer/position.model';
import { EmployeeSkill } from '../skill/skill.model';
import { OnboardingEmployee } from './onboarding.model';

export enum EmployeeStatus {
  RESIGN = 'resign',
  ACTIVE = 'active',
  NO_CONTRACT = 'no_contract',
  TRASH = 'trash',
}

export type EmpResponse = {
  employee: OnboardingEmployee;
};

export type Employee = {
  userId: string;
  id: string;
  email: string;
  fullName: string;
  photo: string;
  departments: Department[];
  position: Position;
  contracts: Contract[];
  bankAccount: bankAccount;
  status: EmployeeStatus;
  createdAt: string;
  resetToken: string;
  roles: Role[];
  positionId: string;
  departmentIds: string[];
  skills: EmployeeSkill[];
  educations: EmployeeEducations[];
};

export type EmployeeResponse = {
  employee: Employee;
};

export type EmployeeCountRequest = {
  departmentId: string;
  positionId: string;
  status: string;
};

export type EmployeesResponse = {
  employees: Employee[];
  pageSize: number;
  pageIndex: number;
  count: number;
};
export type CreateContractEmp = {
  id: string;
  Name: string;
  ContractType: string;
  WorkingType: string;
  StartDate: Date;
  JoinDate: Date;
  EndDate: Date;
  LeaveDate: Date;
};
export type bankAccount = {
  id?: string;
  bankName: string;
  bankBranch: string;
  bankAccountName: string;
  bankAccountNumber: string;
};
export type Approver = {
  id: string;
  fullName: string;
  photo: string;
};
export type ApproverResponse = {
  approvers: Approver[];
  pageSize: number;
  pageIndex: number;
  count: number;
};
export type EmployeeEducations = {
  employeeId?: string;
  id?: string;
  school?: string | null;
  major?: string | null;
  degree?: {
    id: string;
    name: string;
  } | null;
  fromYear?: string | number | null;
  toYear?: string | number | null;
  certificateName?: string | null;
  certificateWebsite?: string | null;
  degreeId?: string | null;
};
export type EmployeeEducationsResponse = {
  educations: EmployeeEducations[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type Degree = {
  id?: string;
  name: string;
};
export type DegreeResponse = {
  degree: Degree;
};

export type DegreesResponse = {
  degrees: Degree[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type TimeKeeper = {
  fingerprintId: string;
  name: string;
};

export type TimeKeeperResponse = {
  data: TimeKeeper[];
};
