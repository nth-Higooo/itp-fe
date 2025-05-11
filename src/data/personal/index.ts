export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword?: string;
};

export type Notification = {
  id: string;
  content: string;
  contentType: string;
  category?: string;
  isRead: boolean;
  assignee: {
    avatar: string;
    displayName: string;
  };
  actions: string;
  createdAt: string;
};

export type NotificationResponse = {
  notifications: Notification[];
  count: number;
};
