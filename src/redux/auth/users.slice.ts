import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addUserAsync,
  countUserSeparatedStatusAsync,
  deleteUserAsync,
  getUserByIdAsync,
  getUsersAsync,
  updateUserAsync,
} from '../../services/auth/user.service';
import { ModalState, RootState, TableFilterState } from '../store';
import { CountUserSeparateStatusResponse, User, UserStatus } from '../../data/auth/user.model';

type UserTableFilter = TableFilterState & {
  status: string | null;
  searchName: string;
};

export type UserState = {
  userList: User[];
  count: number;
  detailUser: User;
  selectedUserId: string[];
  error: string | null;
  modal: ModalState;
  filter: UserTableFilter;
  countAllStatus: CountUserSeparateStatusResponse;
};

export const initUserFilterState: UserTableFilter = {
  pageIndex: 1,
  pageSize: 20,
  // sortField: 'displayName',
  // sortOrder: 'asc',
  sortBy: 'displayName',
  orderBy: 'asc',
  searchName: '',
  status: '',
};

export const initUser: User = {
  id: '',
  resetToken: '',
  username: '',
  email: '',
  displayName: '',
  avatar: '',
  createdAt: '',
  status: UserStatus.PENDING,
  roles: [],
};

export const initUserState: UserState = {
  userList: [],
  count: 0,
  detailUser: initUser,
  selectedUserId: [],
  error: '',
  modal: { open: false, mode: 'add' },
  filter: initUserFilterState,
  countAllStatus: {
    total: 0,
    totalActive: 0,
    totalPending: 0,
    totalDisabled: 0,
    totalDeleted: 0,
  },
};

export const usersSlice = createSlice({
  name: 'users',
  initialState: initUserState,
  reducers: {
    saveUser: (state, action: PayloadAction<UserState>) => {
      state.userList = action.payload.userList;
      return state;
    },
    resetUsersState: (state) => {
      state = initUserState;
      return state;
    },
    selectUserIds: (state, action: PayloadAction<string[]>) => {
      state.selectedUserId = [...action.payload];
      return state;
    },
    setUserModal: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
      return state;
    },
    setUserTableFilter: (state, action: PayloadAction<UserTableFilter>) => {
      state.filter = action.payload;
      return state;
    },
    setDetailUser: (state, action: PayloadAction<User>) => {
      state.detailUser = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.userList = action.payload.users;
        state.count = action.payload.count;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.detailUser = action.payload.user;
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.userList = [...state.userList, action.payload];
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.userList.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.userList[index] = action.payload;
        state.detailUser = action.payload;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.userList = state.userList.filter((u) => u.id !== action.payload);
      })
      .addCase(countUserSeparatedStatusAsync.fulfilled, (state, action) => {
        state.countAllStatus = action.payload;
      });
  },
});

export const {
  saveUser,
  resetUsersState,
  selectUserIds,
  setUserModal,
  setUserTableFilter,
  setDetailUser,
} = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
