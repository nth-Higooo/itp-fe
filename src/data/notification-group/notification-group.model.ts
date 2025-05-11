export type NotificationGroup = {
  id: string;
  type: NotificationGroupType;
  members: NotificationGroupMember[];
  createdAt: string;
};

export type NotificationGroupMember = {
  id: string;
  fullName: string;
};

export enum NotificationGroupType {
  EMPLOYEE_CHANGE_REQUEST = 'EMPLOYEE_CHANGE_REQUEST',
  CONTRACT = 'CONTRACT',
  BIRTHDAY = 'BIRTHDAY',
  OTHER = 'OTHER',
}

export type NotificationGroupsResponse = {
  groupNotifications: NotificationGroup[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type NotificationGroupResponse = {
  NotificationGroup: NotificationGroup;
};

export type NotificationGroupMemberResponse = {
  members: NotificationGroupMember[];
};
