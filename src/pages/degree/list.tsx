import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DegreeListView } from 'src/sections/degree/view/degree-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Degrees | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DegreeListView />
    </>
  );
}
