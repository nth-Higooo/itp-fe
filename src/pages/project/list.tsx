import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProjectListView } from 'src/sections/project/view';

// ----------------------------------------------------------------------

const metadata = { title: `Projects | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProjectListView />
    </>
  );
}
