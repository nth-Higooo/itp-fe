import { createSlice } from '@reduxjs/toolkit';
import { RootState, StateStatus } from '../store';
import {
  NotificationGroup,
  NotificationGroupMember,
} from 'src/data/notification-group/notification-group.model';
import {
  getNotificationGroupMembersAsync,
  getNotificationGroupsAsync,
} from 'src/services/notification-group/notification-group.service';

export type NotificationGroupState = {
  notificationGroups: NotificationGroup[];
  members: NotificationGroupMember[];
  count: number;
  getNotificationGroupsStatus: StateStatus;
  //   countAllStatus: CountNotificationGroupSeparateStatusResponse;
};

const initialState: NotificationGroupState = {
  notificationGroups: [],
  members: [],
  count: 0,
  getNotificationGroupsStatus: 'idle',
  //   countAllStatus: {
  //     total: 0,
  //     totalSales: 0,
  //     totalInProgress: 0,
  //     totalEnd: 0,
  //     totalDeleted: 0,
  //   },
};

export const notificationGroupSlice = createSlice({
  name: 'notificationGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //List
    builder
      .addCase(getNotificationGroupsAsync.pending, (state) => {
        state.getNotificationGroupsStatus = 'loading';
      })
      .addCase(getNotificationGroupsAsync.fulfilled, (state, action) => {
        state.notificationGroups = action.payload.groupNotifications;
        state.count = action.payload.count;
        state.getNotificationGroupsStatus = 'success';
      })
      .addCase(getNotificationGroupsAsync.rejected, (state) => {
        state.getNotificationGroupsStatus = 'failed';
      })
      .addCase(getNotificationGroupMembersAsync.fulfilled, (state, action) => {
        state.members = action.payload;
      });
  },
});

export const selectNotificationGroups = (state: RootState) => state.notificationGroups;

export default notificationGroupSlice.reducer;
