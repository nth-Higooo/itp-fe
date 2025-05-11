import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeeListView } from 'src/sections/employee-manager/view';

// ----------------------------------------------------------------------

const metadata = { title: `Employee List | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeListView />
    </>
  );
}
