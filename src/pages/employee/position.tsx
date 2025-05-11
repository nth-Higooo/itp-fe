import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PositionListView } from 'src/sections/position/view';

// ----------------------------------------------------------------------

const metadata = { title: `Positions | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PositionListView />
    </>
  );
}
