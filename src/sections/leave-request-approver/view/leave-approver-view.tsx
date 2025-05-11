import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LeaveRequestListApprover } from '../leave-approver-list';

// ----------------------------------------------------------------------

export function LeaveApproverView() {
  return <LeaveRequestListApprover />;
}
