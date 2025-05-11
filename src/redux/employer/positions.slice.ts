import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addPositionAsync,
  deletePositionAsync,
  getPositionByIdAsync,
  getPositionsAsync,
  updatePositionAsync,
} from '../../services/employer/position.service';
import { ModalState, RootState, TableFilterState } from '../store';
import { Position } from '../../data/employer/position.model';

type PositionTableFilter = TableFilterState & {
  searchName: string;
};

export type PositionState = {
  positionList: Position[];
  count: number;
  detailPosition: Position;
  selectedPositionId: string[];
  error: string | null;
  modal: ModalState;
  filter: PositionTableFilter;
};

export const initPositionFilterState: PositionTableFilter = {
  pageIndex: 1,
  pageSize: 5,
  // sortField: 'id',
  // sortOrder: 'asc',
  sortBy: 'id',
  orderBy: 'asc',
  searchName: '',
};

export const initPosition: Position = {
  id: '',
  level: '',
  levels: [],
  name: '',
  orderNumber: 0,
  parentId: '',
};
export const initPositionState: PositionState = {
  positionList: [],
  count: 0,
  detailPosition: initPosition,
  selectedPositionId: [],
  error: '',
  modal: { open: false, mode: 'add' },
  filter: initPositionFilterState,
};

export const positionsSlice = createSlice({
  name: 'positions',
  initialState: initPositionState,
  reducers: {
    savePosition: (state, action: PayloadAction<PositionState>) => {
      state.positionList = action.payload.positionList;
      return state;
    },
    resetPositionsState: (state) => {
      state = initPositionState;
      return state;
    },
    selectPositionIds: (state, action: PayloadAction<string[]>) => {
      state.selectedPositionId = [...action.payload];
      return state;
    },
    setPositionModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
      return state;
    },
    setPositionTableFilter: (state, action: PayloadAction<PositionTableFilter>) => {
      state.filter = action.payload;
      return state;
    },
    setDetailPosition: (state, action: PayloadAction<Position>) => {
      state.detailPosition = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPositionsAsync.fulfilled, (state, action) => {
        state.positionList = action.payload.positions;
        state.count = action.payload.count;
      })
      .addCase(getPositionByIdAsync.fulfilled, (state, action) => {
        state.detailPosition = action.payload.position;
      })
      .addCase(addPositionAsync.fulfilled, (state, action) => {
        state.positionList = [...state.positionList, action.payload];
      })
      .addCase(updatePositionAsync.fulfilled, (state, action) => {
        const index = state.positionList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.positionList[index] = action.payload;
        state.detailPosition = action.payload;
        state.positionList.length += 1;
      })
      .addCase(deletePositionAsync.fulfilled, (state, action) => {
        state.positionList = state.positionList.filter((u) => u.id !== action.payload);
      });
  },
});

export const {
  savePosition,
  resetPositionsState,
  selectPositionIds,
  setPositionModal,
  setPositionTableFilter,
  setDetailPosition,
} = positionsSlice.actions;

export const selectPositions = (state: RootState) => state.positions;

export default positionsSlice.reducer;
