import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { LeaveManagerView } from 'src/sections/leave-request-manager/view';

// ----------------------------------------------------------------------

const metadata = { title: `Employee List | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveManagerView />
    </>
  );
}
