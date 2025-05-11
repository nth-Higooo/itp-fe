import skillSlice from './skill/skill.slice';
import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './auth/users.slice';
import contractSlice from './contract';
import employeesSlice from './employee/employees.slice';
import { useDispatch, useSelector } from 'react-redux';
import authSlice from './auth/auth.slice';
import rolesSlice from './auth/roles.slice';
import notificationSlice from './personal/notification.slice';
import positionsSlice from './employer/positions.slice';
import selectionsSlice from './selections/selections.slice';
import onboardingSlice from './onboarding/onboarding.slice';
import departmentsSlice from './employer/departments.slice';
import leaveSlice from './leave/leave.slice';
import holidaysSlice from './holiday/holiday.slice';
import projectSlice from './project/project.slice';
import notificationGroupSlice from './notification-group/notification-group.slice';
import degreesSlice from './employer/degree.slice';
import marketSlice from './market/markets.slice';

export const store = configureStore({
  reducer: {
    users: usersSlice,
    employees: employeesSlice,
    auth: authSlice,
    notification: notificationSlice,
    contract: contractSlice,
    roles: rolesSlice,
    positions: positionsSlice,
    departments: departmentsSlice,
    selections: selectionsSlice,
    onboarding: onboardingSlice,
    leave: leaveSlice,
    skills: skillSlice,
    holidays: holidaysSlice,
    projects: projectSlice,
    markets: marketSlice,
    notificationGroups: notificationGroupSlice,
    degrees: degreesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch<AppDispatch>;

export const useAppSelector = useSelector;

export type StateStatus = 'idle' | 'loading' | 'success' | 'failed';

export type ModalState = {
  open: boolean;
  objectId?: string;
  mode: 'add' | 'update';
};

export type TableFilterState = {
  pageIndex: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  sortBy?: string;
  orderBy?: string;
};
