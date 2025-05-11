import { Employee } from '../employee/employee.model';
import { Department } from '../employer/department.model';

export enum ProjectStatus {
  INITIAL = 'INITIAL',
  PLANNING = 'PLANNING',
  EVALUATION = 'EVALUATION',
  QUOTES = 'QUOTES',
  SIGN_CONTRACT = 'SIGN_CONTRACT',
  REJECT = 'REJECT',
  KICK_OFF = 'KICK_OFF',
  IN_PROGRESS = 'IN_PROGRESS',
  END = 'END',
}

export enum ProjectType {
  ODC = 'ODC',
  PROJECT_BASED = 'PROJECT_BASED',
  TIME_MATERIAL = 'TIME_MATERIAL',
}

export type ProjectRequest = {
  id?: string;
  name: string;
  type: string;
  clientName: string;
  market?: string;
  accountManager?: Employee;
  business?: string;
  projectManager?: Employee;
  technologies?: string;
  startDate: string;
  endDate: string;
  communicationChannels?: string;
  notes?: string;
  status: ProjectStatus;
  department?: Department;
  projectEmployees?: Employee[];
};

export type Project = {
  id?: string;
  name: string;
  type: string;
  clientName: string;
  accountManager?: Employee;
  business?: string;
  market?: string;
  projectManager?: Employee;
  technologies?: string;
  startDate: string;
  endDate: string;
  communicationChannels?: string;
  notes?: string;
  status: ProjectStatus;
  department?: Department;
  projectEmployees?: Employee[];
};

export type ProjectsResponse = {
  projects: Project[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type ProjectResponse = {
  project: Project;
};

export type CountProjectSeparateStatusResponse = {
  total: number;
  totalSales: number;
  totalInProgress: number;
  totalEnd: number;
  totalDeleted: number;
};
