import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDepartmentAsync,
  deleteDepartmentAsync,
  getDepartmentByIdAsync,
  getDepartmentsAsync,
  updateDepartmentAsync,
} from '../../services/employer/department.service';
import { ModalState, RootState, TableFilterState } from '../store';
import { Department } from '../../data/employer/department.model';
import { initEmployee } from '../employee/employees.slice';

type DepartmentTableFilter = TableFilterState & {
  search: string;
};

export type DepartmentState = {
  departmentList: Department[];
  count: number;
  detailDepartment: Department;
  selectedDepartmentId: string[];
  error: string | null;
  modal: ModalState;
  filter: DepartmentTableFilter;
  employeeQuantity: number;
};

export const initDepartmentFilterState: DepartmentTableFilter = {
  pageIndex: 1,
  pageSize: 5,
  search: '',
};

export const initDepartment: Department = {
  id: '',
  name: '',
  manager: initEmployee,
  orderNumber: 0,
  isChild: false,
  parentId: '',
  childrenDepartment: [],
  employeeQuantity: 0,
  type: '',
};

export const initDepartmentState: DepartmentState = {
  departmentList: [],
  count: 0,
  detailDepartment: initDepartment,
  selectedDepartmentId: [],
  error: '',
  modal: { open: false, mode: 'add' },
  filter: initDepartmentFilterState,
  employeeQuantity: 0,
};

export const departmentsSlice = createSlice({
  name: 'departments',
  initialState: initDepartmentState,
  reducers: {
    saveDepartment: (state, action: PayloadAction<Department[]>) => {
      state.departmentList = action.payload;
    },
    resetDepartmentsState: (state) => {
      Object.assign(state, initDepartmentState);
    },
    selectDepartmentIds: (state, action: PayloadAction<string[]>) => {
      state.selectedDepartmentId = action.payload;
    },
    setDepartmentModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
    },
    setDepartmentTableFilter: (state, action: PayloadAction<DepartmentTableFilter>) => {
      state.filter = action.payload;
    },
    setDetailDepartment: (state, action: PayloadAction<Department>) => {
      state.detailDepartment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartmentsAsync.fulfilled, (state, action) => {
        state.departmentList = action.payload.departments;
        state.count = action.payload.count;
        state.employeeQuantity = action.payload.employeeQuantity;
      })
      .addCase(getDepartmentsAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch departments';
      })
      .addCase(getDepartmentByIdAsync.fulfilled, (state, action) => {
        state.detailDepartment = action.payload.department;
      })
      .addCase(addDepartmentAsync.fulfilled, (state, action) => {
        state.departmentList.push(action.payload);
      })
      .addCase(updateDepartmentAsync.fulfilled, (state, action) => {
        const index = state.departmentList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.departmentList[index] = action.payload;
        state.detailDepartment = action.payload;
      })
      .addCase(deleteDepartmentAsync.fulfilled, (state, action) => {
        state.departmentList = state.departmentList.filter((u) => u.id !== action.payload);
      });
  },
});

export const {
  saveDepartment,
  resetDepartmentsState,
  selectDepartmentIds,
  setDepartmentModal,
  setDepartmentTableFilter,
  setDetailDepartment,
} = departmentsSlice.actions;

export const selectDepartments = (state: RootState) => state.departments;

export default departmentsSlice.reducer;
