import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, TableFilterState } from '../store';
import { Contract } from '../../data/contract';

import {
  addContractAsync,
  getContractsByIdAsync,
  handleContract,
  handlePdfContractFile,
  resignContractAsync,
} from '../../services/contract';

export type ContractState = {
  selectedContractIds: string[];
  contractsList: Contract[];
  count: number;
  error?: string;
  selectedContract: Contract;
  params: TableFilterState; // Track the selected contract
};

export const initContractState: ContractState = {
  contractsList: [],
  count: 0,
  selectedContractIds: [],
  error: '',
  selectedContract: {} as Contract,
  params: {
    pageIndex: 1,
    pageSize: 5,
    // sortOrder: 'asc',
    // sortField: 'status',
    orderBy: 'asc',
    sortBy: 'status',
  }, // Initialize as undefined
};

export const ContractsSlice = createSlice({
  name: 'contracts',
  initialState: initContractState,
  reducers: {
    saveContract: (state, action: PayloadAction<ContractState>) => {
      state.contractsList = action.payload.contractsList;
      return state;
    },
    resetContractsState: (state) => {
      state = initContractState;
      return state;
    },
    selectContractIds: (state, action: PayloadAction<string[]>) => {
      state.selectedContractIds = [...action.payload];
      return state;
    },
    removeContract: (state, action: PayloadAction<string>) => {
      state.contractsList = state.contractsList.filter(
        (contract) => contract.id !== action.payload
      );
      return state;
    },
    setContractParams: (state, action: PayloadAction<TableFilterState>) => {
      state.params = action.payload;
      return state;
    },
    selectOneContract: (state, action: PayloadAction<Contract>) => {
      state.selectedContract = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContractsByIdAsync.fulfilled, (state, action) => {
        state.contractsList = action.payload.contracts;
        state.count = action.payload.count;
      })
      .addCase(resignContractAsync.fulfilled, (state, action) => {
        const index = state.contractsList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1)
          state.contractsList[index] = {
            ...state.contractsList[index],
            ...action.payload,
          };
      })
      .addCase(handleContract.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.contractsList.push(action.payload.data.contract);
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(addContractAsync.fulfilled, (state, action) => {
        state.contractsList.push(action.payload.data.contract);
      })
      .addCase(handlePdfContractFile.fulfilled, (state, action) => {
        state.selectedContract.contractFile = action.payload;
      });
  },
});

export const {
  saveContract,
  resetContractsState,
  selectContractIds,
  selectOneContract,
  removeContract,
  setContractParams,
} = ContractsSlice.actions;
export const selectContract = (state: RootState) => state.contract; // Selector for selected contract
export const selectedContract = (state: RootState) => state.contract.selectedContract; // Selector for selected contract
export default ContractsSlice.reducer;
