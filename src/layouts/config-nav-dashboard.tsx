import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';
import { UserPermission } from 'src/data/auth/role.model';
import { title } from 'process';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  notification: icon('ic-notification'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Employee',
    items: [
      {
        title: 'Employee Details',
        path: paths.employee.view,
        icon: ICONS.user,
        searchable: true,
      },
      {
        title: 'Leave',
        path: paths.leave.submit,
        icon: ICONS.chat,
        searchable: true,
      },
    ],
  },
  {
    subheader: 'Employer',
    items: [
      {
        title: 'Employees',
        path: paths.employee.list,
        icon: ICONS.user,
        children: [
          {
            title: 'Employee List',
            path: paths.employee.list,
            permission: UserPermission.EMPLOYEE_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Leave Management',
            path: paths.employee.leaveRequest,
            permission: UserPermission.LEAVE_MANAGEMENT,
            searchable: true,
          },
        ],
      },
      {
        title: 'Projects',
        path: paths.project.list,
        icon: ICONS.kanban,
        children: [
          {
            title: 'Project List',
            path: paths.project.list,
            permission: UserPermission.PROJECT_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Project Kanban',
            path: paths.project.kanban,
            permission: UserPermission.PROJECT_MANAGEMENT,
            searchable: true,
          },
        ],
      },
      {
        title: 'Settings',
        path: paths.employerSettings.list,
        icon: <Iconify icon="solar:settings-bold-duotone" width={24} />,
        children: [
          {
            title: 'Degrees',
            path: paths.employerSettings.degrees,
            permission: UserPermission.DEGREE_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Departments',
            path: paths.employerSettings.departments,
            permission: UserPermission.DEPARTMENT_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Positions & Level',
            path: paths.employerSettings.positions,
            permission: UserPermission.POSITION_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Leave Types',
            path: paths.employerSettings.leaveTypes,
            permission: UserPermission.LEAVE_TYPE_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Holidays',
            path: paths.employerSettings.holidays,
            permission: UserPermission.HOLIDAY_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Skill Types',
            path: paths.employerSettings.skillTypes,
            permission: UserPermission.SKILL_TYPE_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'Markets',
            path: paths.employerSettings.markets,
            permission: UserPermission.MARKET_MANAGEMENT,
            searchable: true,
          },
        ],
      },
      {
        title: 'Timesheet',
        path: paths.leave.timesheet,
        icon: ICONS.calendar,
        permission: UserPermission.TIME_SHEET_MANAGEMENT,
        searchable: true,
      },
    ],
  },
  {
    subheader: 'Manager',
    items: [
      {
        title: 'My Team',
        path: paths.manager.manage,
        icon: ICONS.user,
        children: [
          {
            title: 'My Employees',
            path: paths.manager.list,
            permission: UserPermission.EMPLOYEE_MANAGEMENT,
            searchable: true,
          },
          {
            title: 'My Leave Requests',
            path: paths.manager.leaveRequests,
            permission: UserPermission.LEAVE_MANAGEMENT,
            searchable: true,
          },
        ],
      },
      {
        title: 'Approve Leave Request',
        icon: ICONS.label,
        path: paths.approver.leaveRequest,
        permission: UserPermission.LEAVE_MANAGEMENT,
        searchable: true,
      },
    ],
  },
  {
    subheader: 'Administrator',
    items: [
      {
        title: 'Users',
        path: paths.user.list,
        icon: ICONS.user,
        permission: UserPermission.USER_MANAGEMENT,
        searchable: true,
      },
      {
        title: 'Roles & Permission',
        path: paths.user.role,
        icon: ICONS.lock,
        permission: UserPermission.ROLE_MANAGEMENT,
        searchable: true,
      },
      {
        title: 'Notification Groups',
        path: paths.user.notificationGroup,
        icon: <Iconify icon="solar:bell-bing-bold-duotone" width={24} />,

        permission: UserPermission.GROUP_NOTIFICATION_MANAGEMENT,
        searchable: true,
      },
    ],
  },
];
