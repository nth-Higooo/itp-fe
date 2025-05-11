import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ChangePasswordForm } from '../change-password-form';

// ----------------------------------------------------------------------

export function ChangePasswordView() {
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs heading="Change password" />

        <ChangePasswordForm />
      </DashboardContent>
    </>
  );
}
