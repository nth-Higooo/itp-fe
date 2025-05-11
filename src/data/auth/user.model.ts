import { OnboardingEmployee } from '../employee/onboarding.model';
import { Role } from './role.model';

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export type UserRequest = {
  id?: string;
  email: string;
  username: string;
  displayName: string;
  status: UserStatus;
  avatar: string;
  roles: Role[];
};

export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  status: UserStatus;
  createdAt: string;
  resetToken: string;
  roles: Role[];
  employee?: OnboardingEmployee;
};

export type UserResponse = {
  currentOnboardingStep: number;
  user: User;
};

export type UsersResponse = {
  users: User[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type CountUserSeparateStatusResponse = {
  total: number;
  totalActive: number;
  totalPending: number;
  totalDisabled: number;
  totalDeleted: number;
};
