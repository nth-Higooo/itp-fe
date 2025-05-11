import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '../../data/auth/role.model';
import { RootState, StateStatus } from '../store';
import { Degree, Employee, TimeKeeper } from '../../data/employee/employee.model';
import { Position, position_levels } from '../../data/employer/position.model';
import { Department } from '../../data/employer/department.model';
import {
  getAllDepartmentsAsync,
  getAllPositionsLevels,
  getAllRolesAsync,
  getAllEmployeesAsync,
  getAllLeaveTypeAsync,
  getAllPositionsWithLevels,
  getAllSkillTypeAsync,
  getTimeKeeperUsersAsync,
} from '../../services/selection.service';
import { LeaveType } from 'src/data/leave/leave.model';
import { SkillType } from 'src/data/skill/skill.model';
import { getDegreesAsync } from 'src/services/Degree/degree.service';
import { Market } from 'src/data/market/market.model';
import { getMarketAsync } from 'src/services/market.service';

export type SelectState = {
  roles: Role[];
  positions: Position[];
  positionWithLevels: position_levels[];
  departments: Department[];
  employees: Employee[];
  markets: Market[];
  skillTypes: SkillType[];
  skillNames: SkillType[];
  leaveTypes: LeaveType[];
  degrees: Degree[];
  timekeeperUsers: any;
  getDegreesStatus: StateStatus;
  getTimeKeeperStatus: StateStatus;
  getAllRoleStatus: StateStatus;
  getPositionsStatus: StateStatus;
  getDepartmentStatus: StateStatus;
  getEmployeeStatus: StateStatus;
  getAllLeaveTypeStatus: StateStatus;
  getSkillTypeStatus: StateStatus;
};

const initSelectState: SelectState = {
  roles: [],
  getAllRoleStatus: 'idle',
  positionWithLevels: [],
  getDepartmentStatus: 'idle',
  getPositionsStatus: 'idle',
  getEmployeeStatus: 'idle',
  positions: [],
  departments: [],
  markets: [],
  employees: [],
  leaveTypes: [],
  getAllLeaveTypeStatus: 'idle',
  skillTypes: [],
  getSkillTypeStatus: 'idle',
  skillNames: [],
  timekeeperUsers: [],
  getTimeKeeperStatus: 'idle',
  degrees: [],
  getDegreesStatus: 'idle',
};

export const selectionsSlice = createSlice({
  name: 'selections',
  initialState: initSelectState,
  reducers: {
    setPositions: (state, action: PayloadAction<Position[]>) => {
      state.positions = action.payload;
      return state;
    },
    setDepartments: (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload;
      return state;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
      return state;
    },
    setDegree: (state, action: PayloadAction<Degree[]>) => {
      state.degrees = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    //Roles
    builder.addCase(getAllRolesAsync.pending, (state) => {
      state.getAllRoleStatus = 'loading';
    });
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      state.roles = action.payload.roles;
      state.getAllRoleStatus = 'success';
    });
    builder.addCase(getAllRolesAsync.rejected, (state) => {
      state.getAllRoleStatus = 'failed';
    });

    //Employees
    builder.addCase(getAllEmployeesAsync.pending, (state) => {
      state.getEmployeeStatus = 'loading';
    });
    builder.addCase(getAllEmployeesAsync.rejected, (state) => {
      state.getEmployeeStatus = 'failed';
    });
    builder.addCase(getAllEmployeesAsync.fulfilled, (state, action) => {
      state.employees = action.payload.employees;
    });

    //Departments
    builder.addCase(getAllDepartmentsAsync.pending, (state) => {
      state.getDepartmentStatus = 'loading';
    });
    builder.addCase(getAllDepartmentsAsync.rejected, (state) => {
      state.getDepartmentStatus = 'failed';
    });
    builder.addCase(getAllDepartmentsAsync.fulfilled, (state, action) => {
      state.getDepartmentStatus = 'success';
      state.departments = action.payload;
    });

    //Positions
    builder.addCase(getAllPositionsLevels.pending, (state) => {
      state.getPositionsStatus = 'loading';
    });
    builder.addCase(getAllPositionsLevels.rejected, (state) => {
      state.getPositionsStatus = 'failed';
    });
    builder.addCase(getAllPositionsLevels.fulfilled, (state, action) => {
      state.getPositionsStatus = 'success';
      state.positions = action.payload;
    });
    builder.addCase(getAllPositionsWithLevels.rejected, (state) => {
      state.getPositionsStatus = 'failed';
    });
    builder.addCase(getAllPositionsWithLevels.fulfilled, (state, action) => {
      state.positionWithLevels = action.payload;
    });

    //LeaveTypes
    builder.addCase(getAllLeaveTypeAsync.fulfilled, (state, action) => {
      state.leaveTypes = action.payload.leaveTypes;
    });

    //Skill Types
    builder.addCase(getAllSkillTypeAsync.fulfilled, (state, action) => {
      state.skillTypes = action.payload.skillTypes;
    });

    //Time Keeper User
    builder.addCase(getTimeKeeperUsersAsync.fulfilled, (state, action) => {
      state.timekeeperUsers = action.payload.data;
    });

    //Degrees
    builder.addCase(getDegreesAsync.fulfilled, (state, action) => {
      state.degrees = action.payload.degrees;
    });
    //Markets
    builder.addCase(getMarketAsync.fulfilled, (state, action) => {
      state.markets = action.payload.markets;
    });
  },
});

export const { setPositions, setDepartments, setRoles } = selectionsSlice.actions;

export const selectSelections = (state: RootState) => state.selections;

export default selectionsSlice.reducer;
