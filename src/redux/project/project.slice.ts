import { createSlice } from '@reduxjs/toolkit';
import { RootState, StateStatus } from '../store';
import { countProjectSeparatedStatusAsync, getProjectsAsync } from 'src/services/project.service';
import { CountProjectSeparateStatusResponse, Project } from 'src/data/project';

export type ProjectState = {
  projects: Project[];
  count: number;
  getNotifyByUserStatus: StateStatus;
  countAllStatus: CountProjectSeparateStatusResponse;
};

const initialState: ProjectState = {
  projects: [],
  count: 0,
  getNotifyByUserStatus: 'idle',
  countAllStatus: {
    total: 0,
    totalSales: 0,
    totalInProgress: 0,
    totalEnd: 0,
    totalDeleted: 0,
  },
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //List
    builder
      .addCase(getProjectsAsync.pending, (state) => {
        state.getNotifyByUserStatus = 'loading';
      })
      .addCase(getProjectsAsync.fulfilled, (state, action) => {
        state.projects = action.payload.projects;
        state.count = action.payload.count;
        state.getNotifyByUserStatus = 'success';
      })
      .addCase(getProjectsAsync.rejected, (state) => {
        state.getNotifyByUserStatus = 'failed';
      })

      .addCase(countProjectSeparatedStatusAsync.fulfilled, (state, action) => {
        state.countAllStatus = action.payload;
      });
  },
});

export const selectProjects = (state: RootState) => state.projects;

export default projectSlice.reducer;
