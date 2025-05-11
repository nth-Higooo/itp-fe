import { lazy, Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import LeaveRequestPage from 'src/pages/leave-request/request';
import LeavePageOfEmployee from 'src/sections/leave-request/view/leave-page-view';
import { UserPermission } from 'src/data/auth/role.model';

// ----------------------------------------------------------------------
const IndexPage = lazy(() => import('src/pages/dashboard'));

const UserListPage = lazy(() => import('src/pages/user/list'));
const RoleListPage = lazy(() => import('src/pages/role/list'));
const RoleEditPage = lazy(() => import('src/pages/role/edit'));
const EmployeeListPage = lazy(() => import('src/pages/employee/list'));
const EmployeeNewPage = lazy(() => import('src/pages/employee/new'));
const EmployeeEditPage = lazy(() => import('src/pages/employee/edit'));
const DepartmentListPage = lazy(() => import('src/pages/employee/department'));
const ChangeRequestPage = lazy(() => import('src/pages/employee/change-request'));
const PositionListPage = lazy(() => import('src/pages/employee/position'));
const LeaveTypeListPage = lazy(() => import('src/pages/leave-type/list'));
const LeaveRequestListPage = lazy(() => import('src/pages/leave-request/list'));
const HolidayListPage = lazy(() => import('src/pages/holiday/list'));
const EmployeeDetailsViewPage = lazy(() => import('src/pages/employee-details/view'));
const ChangePasswordPage = lazy(() => import('src/pages/personal/change-password'));
const LeaveRequestByApprover = lazy(() => import('src/pages/approve-leave/list'));
const EmployeeListByManager = lazy(() => import('src/pages/manager/employeeList'));
const LeaveRequestByManager = lazy(() => import('src/pages/manager/leaveRequest'));
const ProjectListPage = lazy(() => import('src/pages/project/list'));
const ProjectKanbanPage = lazy(() => import('src/pages/project/kanban'));
const SkillTypeListPage = lazy(() => import('src/pages/skill-type/list'));
const NotificationGroupsPage = lazy(() => import('src/pages/notification-group/list'));
const DegreeListPage = lazy(() => import('src/pages/degree/list'));
const MarketListPage = lazy(() => import('src/pages/markets/list'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'employee-details',
        element: <EmployeeDetailsViewPage />,
        handle: {
          permission: UserPermission.EMPLOYEE_MANAGEMENT,
        },
      },
      {
        path: 'submit-leave',
        children: [
          { element: <LeavePageOfEmployee />, index: true },
          { path: ':id', element: <LeavePageOfEmployee /> },
        ],
      },
      { path: 'timesheet', element: <></> },
      {
        path: 'projects',
        children: [
          { element: <ProjectListPage />, index: true },
          { path: 'kanban', element: <ProjectKanbanPage /> },
        ],
      },
      {
        path: 'employees',
        children: [
          { element: <EmployeeListPage />, index: true },
          { path: 'create', element: <EmployeeNewPage /> },
          { path: ':id', element: <EmployeeEditPage /> },
          { path: ':id/change-request', element: <ChangeRequestPage /> },
          { path: 'leave-requests', element: <LeaveRequestListPage /> },
          { path: 'leave-requests/:id', element: <LeaveRequestPage /> },
        ],
      },
      {
        path: 'settings',
        children: [
          { path: 'departments', element: <DepartmentListPage /> },
          { path: 'positions', element: <PositionListPage /> },
          { path: 'leave-types', element: <LeaveTypeListPage /> },
          { path: 'holidays', element: <HolidayListPage /> },
          { path: 'degrees', element: <DegreeListPage /> },
          { path: 'skill-types', element: <SkillTypeListPage /> },
          { path: 'markets', element: <MarketListPage /> },
        ],
      },
      {
        path: 'manage',
        children: [
          { path: 'list-employees', element: <EmployeeListByManager />, index: true },
          { path: 'leave-requests', element: <LeaveRequestByManager /> },
        ],
      },
      { path: 'leave-requests-approver', element: <LeaveRequestByApprover /> },
      { path: 'leave-requests-approver/:id', element: <LeaveRequestByApprover /> },
      { path: 'change-password', element: <ChangePasswordPage /> },
      {
        path: 'users',
        children: [
          { element: <UserListPage />, index: true },
          { path: ':id', element: <UserListPage /> },
        ],
      },
      {
        path: 'roles',
        children: [
          { element: <RoleListPage />, index: true },
          { path: ':id', element: <RoleEditPage /> },
        ],
      },
      { path: 'notification-groups', element: <NotificationGroupsPage /> },
    ],
  },
];
