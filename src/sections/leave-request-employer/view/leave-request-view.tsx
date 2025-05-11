import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { LeaveRequestList } from '../leave-request-list';
import { Iconify } from 'src/components/iconify';
import { Card, Tab, Tabs } from '@mui/material';
import { useTabs } from 'src/hooks/use-tabs';
import { varAlpha } from 'src/theme/styles';
import { TTheme } from 'src/theme/create-theme';
import { LeaveInformationList } from '../leave-information-list';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const TABS = [
  {
    value: 'all',
    label: 'All Request',
    icon: <Iconify icon="solar:checklist-minimalistic-bold" width={24} />,
  },
  {
    value: 'remaining',
    label: 'Remaining Leave',
    icon: <Iconify icon="solar:notebook-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export function LeaveRequestView() {
  const tabs = useTabs('all');

  return (
    <DashboardContent>
      <CustomBreadcrumbs heading="Employee leave request management" />
      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 2.5,
            boxShadow: (theme: TTheme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {tabs.value === 'all' && <LeaveRequestList />}

        {tabs.value === 'remaining' && <LeaveInformationList />}
      </Card>
    </DashboardContent>
  );
}
