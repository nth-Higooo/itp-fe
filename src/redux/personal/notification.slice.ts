import { createSlice } from '@reduxjs/toolkit';
import { RootState, StateStatus } from '../store';
import { getNotificationsByUserIdAsync } from 'src/services/notification.service';

export type SelectState = {
  notifications: any[];
  count: number;
  getNotifyByUserStatus: StateStatus;
};

const initialState: SelectState = {
  notifications: [],
  count: 0,
  getNotifyByUserStatus: 'idle',
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //List
    builder.addCase(getNotificationsByUserIdAsync.pending, (state) => {
      state.getNotifyByUserStatus = 'loading';
    });
    builder.addCase(getNotificationsByUserIdAsync.fulfilled, (state, action) => {
      state.notifications = action.payload.notifications;
      state.count = action.payload.count;
      state.getNotifyByUserStatus = 'success';
    });
    builder.addCase(getNotificationsByUserIdAsync.rejected, (state) => {
      state.getNotifyByUserStatus = 'failed';
    });
  },
});

export const selectNotifications = (state: RootState) => state.notification;

export default notificationSlice.reducer;
