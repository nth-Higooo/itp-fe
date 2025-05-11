import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { LeaveRequestView } from 'src/sections/leave-request-employer/view/leave-request-view';

// ----------------------------------------------------------------------

const metadata = { title: `Leave Request List| ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveRequestView />
    </>
  );
}
