import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DepartmentListView } from 'src/sections/department/view';

// ----------------------------------------------------------------------

const metadata = { title: `Departments | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DepartmentListView />
    </>
  );
}
