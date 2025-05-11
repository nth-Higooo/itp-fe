import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { MarketListView } from 'src/sections/markets/view/market-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Markets | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MarketListView />
    </>
  );
}
