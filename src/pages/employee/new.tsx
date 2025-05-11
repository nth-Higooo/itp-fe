import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeeFormView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new employee | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeFormView role="Employer" />
    </>
  );
}
