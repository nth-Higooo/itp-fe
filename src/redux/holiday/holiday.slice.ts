import { Holiday } from '../../data/holiday/holiday.model';
import { ModalState, TableFilterState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addHolidayAsync,
  deleteHolidayAsync,
  getHolidaysAsync,
  updateHolidayAsync,
} from '../../services/holiday/holiday.service';
import { RootState } from '../store';

type HolidayTableState = TableFilterState;

export const initHolidayTableState: HolidayTableState = {
  pageIndex: 1,
  pageSize: 5,
};

export type HolidayState = {
  holidayList: Holiday[];
  count: number;
  detailHoliday: Holiday;
  selectedHolidayId: string[];
  error: string | null;
  modal: ModalState;
  filter: HolidayTableState;
};

export type HolidayForm = {
  id: string;
  name: string;
  dateRange: Date[];
};

export const initHoliday: Holiday = {
  id: '',
  name: '',
  startDate: null,
  endDate: null,
};

export const initHolidayForm: HolidayForm = {
  id: '',
  name: '',
  dateRange: [],
};

export const initHolidayState: HolidayState = {
  holidayList: [],
  count: 0,
  detailHoliday: initHoliday,
  selectedHolidayId: [],
  error: null,
  modal: {
    open: false,
    mode: 'add',
  },
  filter: initHolidayTableState,
};

export const holidaysSlice = createSlice({
  name: 'holidays',
  initialState: initHolidayState,
  reducers: {
    setHolidayList: (state, action) => {
      state.holidayList = action.payload.holidayList;
      return state;
    },
    resetHolidaysState: (state) => {
      state = initHolidayState;
      return state;
    },
    selectHolidayIds: (state, action: PayloadAction<string[]>) => {
      state.selectedHolidayId = [...action.payload];
      return state;
    },
    setHolidayModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
      return state;
    },
    setDetailHoliday: (state, action: PayloadAction<Holiday>) => {
      state.detailHoliday = action.payload;
      return state;
    },
    setHolidayTableFilter: (state, action: PayloadAction<HolidayTableState>) => {
      state.filter = action.payload;
      return state;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getHolidaysAsync.fulfilled, (state, action) => {
        state.holidayList = action.payload.holidays;
        state.count = action.payload.count;
      })
      .addCase(addHolidayAsync.fulfilled, (state, action) => {
        state.holidayList = [...state.holidayList, action.payload];
      })
      .addCase(updateHolidayAsync.fulfilled, (state, action) => {
        const index = state.holidayList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.holidayList[index] = action.payload;
        state.detailHoliday = action.payload;
      })
      .addCase(deleteHolidayAsync.fulfilled, (state, action) => {
        state.holidayList = state.holidayList.filter((u) => u.id !== action.payload);
      });
  },
});

export const {
  setHolidayList,
  resetHolidaysState,
  selectHolidayIds,
  setHolidayModal,
  setDetailHoliday,
  setHolidayTableFilter,
} = holidaysSlice.actions;

export const selectHolidays = (state: RootState) => state.holidays;

export default holidaysSlice.reducer;
