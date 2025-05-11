import { Degree } from 'src/data/employee/employee.model';
import { ModalState, RootState, TableFilterState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDegreeAsync,
  deleteDegreeAsync,
  getDegreesAsync,
  updateDegreeAsync,
} from 'src/services/Degree/degree.service';

type DegreeTableState = TableFilterState;

export const initDegreeTableState: DegreeTableState = {
  pageIndex: 1,
  pageSize: 5,
};

export type DegreeState = {
  degreeList: Degree[];
  count: number;
  error: string | null;
  modal: ModalState;
  filter: DegreeTableState;
  degreeDetail: Degree;
};

export type DegreeForm = {
  id: string;
  name: string;
};

export const initDegree: Degree = {
  id: '',
  name: '',
};

export const initDegreeForm: DegreeForm = {
  id: '',
  name: '',
};

export const initDegreeState: DegreeState = {
  degreeList: [],
  count: 0,
  error: null,
  modal: {
    open: false,
    mode: 'add',
  },
  filter: initDegreeTableState,
  degreeDetail: {
    id: '',
    name: '',
  },
};

export const degreesSlice = createSlice({
  name: 'holidays',
  initialState: initDegreeState,
  reducers: {
    setDegreeList: (state, action) => {
      state.degreeList = action.payload.holidayList;
      return state;
    },
    resetDegreesState: (state) => {
      state = initDegreeState;
      return state;
    },

    setDegreeModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
      return state;
    },

    setDegreeTableFilter: (state, action: PayloadAction<DegreeTableState>) => {
      state.filter = action.payload;
      return state;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getDegreesAsync.fulfilled, (state, action) => {
        state.degreeList = action.payload.degrees;
        state.count = action.payload.count;
      })
      .addCase(addDegreeAsync.fulfilled, (state, action) => {
        state.degreeList.push(action.payload.degree);
      })
      .addCase(updateDegreeAsync.fulfilled, (state, action) => {
        const index = state.degreeList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.degreeList[index] = action.payload;
        state.degreeDetail = action.payload;
      })
      .addCase(deleteDegreeAsync.fulfilled, (state, action) => {
        state.degreeList = state.degreeList.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setDegreeList, resetDegreesState, setDegreeModal, setDegreeTableFilter } =
  degreesSlice.actions;

export const selectDegrees = (state: RootState) => state.degrees;

export default degreesSlice.reducer;
