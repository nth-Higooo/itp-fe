import { Tab, Tabs } from '@mui/material';
import React, { useEffect } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { LeaveRegulationOfEmployeeView } from '../leave-regulation-of-employee';
import LeaveRequestList from '../leave-requests-list';
import { useParams } from 'react-router';
import { useAppDispatch } from 'src/redux/store';
import { selectLeaveId } from 'src/redux/leave/leave.slice';

const TABS = [
  {
    value: 'leaveRequest',
    label: 'Request to Leave',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'allRequest',
    label: 'All Requests',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
];

function LeavePageOfEmployee() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id) {
      dispatch(selectLeaveId(id));
      tabs.setValue('allRequest');
    }
  }, [id]);
  const tabs = useTabs('leaveRequest');
  return (
    <DashboardContent>
      <CustomBreadcrumbs heading={'Leave Request'} />
      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {tabs.value === 'leaveRequest' && <LeaveRegulationOfEmployeeView />}
      {tabs.value === 'allRequest' && <LeaveRequestList currentRequestId={id} />}
    </DashboardContent>
  );
}

export default LeavePageOfEmployee;
