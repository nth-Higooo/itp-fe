// ----------------------------------------------------------------------

export const paths = {
  auth: {
    signIn: '/auth/sign-in',
    forgotPassword: '/auth/forgot-password',
    newPassword: '/auth/new-password',
  },
  user: {
    list: '/users',
    update: ({ id, roles }: { id: string; roles: string[] }) => {
      const rolesParam = roles.join('|');
      return `/users/${id}?roles=${rolesParam}`;
    },
    role: '/roles',
    notificationGroup: '/notification-groups',
    roleDetails: (id: string) => `/roles/${id}`,
  },
  employee: {
    list: '/employees',
    new: '/employees/create',
    edit: (id: string) => `/employees/${id}`,
    view: '/employee-details',
    leaveRequest: '/employees/leave-requests',
  },
  project: {
    list: '/projects',
    kanban: '/projects/kanban',
  },
  leave: {
    submit: '/submit-leave',
    timesheet: '/timesheet',
  },
  employerSettings: {
    list: '/settings',
    departments: '/settings/departments',
    positions: '/settings/positions',
    holidays: '/settings/holidays',
    leaveTypes: '/settings/leave-types',
    degrees: '/settings/degrees',
    skillTypes: '/settings/skill-types',
    markets: '/settings/markets',
  },
  approver: {
    leaveRequest: '/leave-requests-approver',
  },
  manager: {
    manage: '/manage',
    list: '/manage/list-employees',
    leaveRequests: '/manage/leave-requests',
  },
  main: {
    comingSoon: '/coming-soon',
    error403: '/403',
    error404: '/404',
    error500: '/500',
  },
  dashboard: {
    root: '/',
  },
};
