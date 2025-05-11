import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { BaseResponse } from 'src/data/base-response.model';
import { Market, MarketResponse } from 'src/data/market/market.model';
import { DELETE, GET, POST, PUT } from './axios';
import { TableFilterState } from 'src/redux/store';

export const getMarketAsync = createAsyncThunk(
  'market/getMarketAsync',
  async (params?: TableFilterState) => {
    const response: AxiosResponse<BaseResponse<MarketResponse>> = await GET('/markets', { params });
    return response.data.data;
  }
);

export const addMarketAsync = createAsyncThunk('market/addMarketAsync', async (payload: Market) => {
  const response: AxiosResponse<BaseResponse<MarketResponse>> = await POST('/markets', payload);
  return response.data.data;
});

export const updateMarketAsync = createAsyncThunk(
  'market/updateMarketAsync',
  async (payload: Market) => {
    const response: AxiosResponse<BaseResponse<MarketResponse>> = await PUT(
      `/markets/${payload.id}`,
      payload
    );
    return response.data.data;
  }
);

export const deleteMarketAsync = createAsyncThunk(
  'market/deleteMarketAsync',
  async (id: string) => {
    const response: AxiosResponse<BaseResponse<string>> = await DELETE(`/markets/${id}`);
    return response.data.data;
  }
);
