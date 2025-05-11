import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LeaveTypeListView } from 'src/sections/leave-type/view';

// ----------------------------------------------------------------------

const metadata = { title: `Leave Types | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveTypeListView />
    </>
  );
}
