import { createSlice } from '@reduxjs/toolkit';
import { RootState, StateStatus } from '../store';
import { Market } from 'src/data/market/market.model';
import { getMarketAsync } from 'src/services/market.service';

export type MarketStage = {
  markets: Market[];
  count: number;
};

const initialState: MarketStage = {
  markets: [],
  count: 0,
};

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //List
    builder.addCase(getMarketAsync.fulfilled, (state, action) => {
      state.markets = action.payload.markets;
      state.count = action.payload.count;
    });
  },
});

export const selectMarkets = (state: RootState) => state.markets;

export default marketSlice.reducer;
