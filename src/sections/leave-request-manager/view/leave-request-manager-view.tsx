import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LeaveRequestListManager } from '../leave-request-table-list';

// ----------------------------------------------------------------------

export function LeaveManagerView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs heading="Leave Request" />
      <LeaveRequestListManager />
    </DashboardContent>
  );
}
