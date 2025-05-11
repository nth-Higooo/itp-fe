import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EmployeeTabGeneral, EmployeeTabProps } from '../employee-tab-general';
import { EmployeeTabContract } from '../employee-tab-contract';
import { EmployeeTabSalary } from '../employee-tab-salary';
import { useAppSelector } from 'src/redux/store';
import { selectAuth } from 'src/redux/auth/auth.slice';
import { OnboardingEmployee } from 'src/data/employee/onboarding.model';
import { ReactNode, useEffect } from 'react';
import { EmployeeBenefit } from '../employee-tab-benefit';
import TokenService from 'src/services/token.service';
import { UserPermission } from 'src/data/auth/role.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

const TABS_CREATE = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
];

let TABS_EDIT = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  {
    value: 'contract',
    label: 'Contract',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  { value: 'salary', label: 'Salary', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
  {
    value: 'benefit',
    label: 'Benefit',
    icon: <Iconify icon="solar:star-fall-minimalistic-2-bold-duotone" width={24} />,
  },
];

// ----------------------------------------------------------------------

type EmployeeFormViewProps = EmployeeTabProps & {
  action?: ReactNode;
};

export function EmployeeFormView({
  currentEmployee,
  canEdit = true,
  role = 'Employee',
  action,
}: EmployeeFormViewProps) {
  const tabs = useTabs('general');
  const location = useLocation();
  const isShowSalary = useBoolean(false);
  const isShowBenefit = useBoolean(false);

  useEffect(() => {
    if (location.pathname.includes('employee-details')) {
      isShowSalary.onTrue();
      isShowBenefit.onTrue();
    } else {
      const showSalary = TokenService.getPermissions().some(
        (p) => p.permission === UserPermission.EMPLOYEE_MANAGEMENT && p.canViewSalary
      );
      isShowSalary.setValue(showSalary);
      const showBenefit = TokenService.getPermissions().some(
        (p) => p.permission === UserPermission.EMPLOYEE_MANAGEMENT && p.canViewBenefit
      );
      isShowBenefit.setValue(showBenefit);
    }
  }, [location.pathname]);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={currentEmployee ? 'Employee Details' : 'Create a new employee'}
        action={action}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {(currentEmployee ? TABS_EDIT : TABS_CREATE).map((tab) => {
          if (tab.value === 'salary' && !isShowSalary.value) return null;
          if (tab.value === 'benefit' && !isShowBenefit.value) return null;
          return <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />;
        })}
      </Tabs>

      {tabs.value === 'general' && (
        <EmployeeTabGeneral currentEmployee={currentEmployee} canEdit={canEdit} role={role} />
      )}

      {tabs.value === 'contract' && (
        <EmployeeTabContract currentEmployee={currentEmployee} canEdit={canEdit} role={role} />
      )}

      {tabs.value === 'salary' && isShowSalary.value && (
        <EmployeeTabSalary currentEmployee={currentEmployee} canEdit={canEdit} role={role} />
      )}

      {tabs.value === 'benefit' && isShowBenefit.value && (
        <EmployeeBenefit currentEmployee={currentEmployee} canEdit={canEdit} role={role} />
      )}
    </DashboardContent>
  );
}
