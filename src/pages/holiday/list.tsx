import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HolidayListView } from 'src/sections/holiday/view';

// ----------------------------------------------------------------------

const metadata = { title: `Holidays | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <HolidayListView />
    </>
  );
}
