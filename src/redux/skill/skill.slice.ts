import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addSkillTypeAsync,
  deleteSkillTypeAsync,
  getSkillTypeAsync,
  updateSkillTypeChildAsync,
  updateSkillTypeParentAsync,
} from 'src/services/skill/skill.service';
import { ModalState, RootState, TableFilterState } from '../store';
import { SkillType } from 'src/data/skill/skill.model';

type SkillTableFilter = TableFilterState & {
  search: string;
};
export const initSkillTableFilter: SkillTableFilter = {
  pageIndex: 1,
  pageSize: 5,
  search: '',
};

export type SkillState = {
  selectedSkillTypeId: string[];
  skillTypeList: SkillType[];
  detailSkillType: SkillType;
  selectedSkillType?: SkillType;
  count: number;
  filter: SkillTableFilter;
  modal: ModalState;
  error: string | null;
};

export const initSkillType: SkillType = {
  orderNumber: 0,
  name: '',
  parentId: null,
  skillName: null,
  skillNames: [],
};

export const initSkillState: SkillState = {
  skillTypeList: [],
  selectedSkillTypeId: [],
  count: 0,
  detailSkillType: initSkillType,
  filter: initSkillTableFilter,
  modal: {
    open: false,
    mode: 'add',
  },
  error: '',
};

export const skillSlice = createSlice({
  name: 'skill',
  initialState: initSkillState,
  reducers: {
    saveSkillType: (state, action: PayloadAction<SkillType[]>) => {
      state.skillTypeList = action.payload;
    },
    resetSkillTypesState: (state) => {
      Object.assign(state, initSkillState);
    },
    selectSkillTypesIds: (state, action: PayloadAction<string[]>) => {
      state.selectedSkillTypeId = action.payload;
    },
    setDepartmentModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
    },
    setDepartmentTableFilter: (state, action: PayloadAction<SkillTableFilter>) => {
      state.filter = action.payload;
    },
    setDetailDepartment: (state, action: PayloadAction<SkillType>) => {
      state.detailSkillType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSkillTypeAsync.fulfilled, (state, action) => {
        state.skillTypeList = action.payload.skillTypes;
        state.count = action.payload.count;
      })
      .addCase(getSkillTypeAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch skill types';
      })
      .addCase(addSkillTypeAsync.fulfilled, (state, action) => {
        state.skillTypeList = [...state.skillTypeList, action.payload];
      })
      // .addCase(updateSkillTypeParentAsync.fulfilled, (state, action) => {
      //   const index = state.skillTypeList.findIndex((u) => u.id === action.payload.id);
      //   if (index !== -1) state.skillTypeList[index] = action.payload;
      //   state.detailSkillType = action.payload;
      // })
      // .addCase(updateSkillTypeChildAsync.fulfilled, (state, action) => {
      //   const index = state.skillTypeList.findIndex((u) => u.id === action.payload.id);
      //   if (index !== -1) state.skillTypeList[index] = action.payload;
      //   state.detailSkillType = action.payload;
      // })
      .addCase(deleteSkillTypeAsync.fulfilled, (state, action) => {
        state.skillTypeList = state.skillTypeList.filter((u) => u.id !== action.payload);
      });
  },
});
export const {
  saveSkillType,
  resetSkillTypesState,
  selectSkillTypesIds,
  setDepartmentModal,
  setDepartmentTableFilter,
  setDetailDepartment,
} = skillSlice.actions;

export const selectSkill = (state: RootState) => state.skills;
export default skillSlice.reducer;
