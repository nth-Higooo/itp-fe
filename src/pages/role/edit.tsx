import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RoleFormView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

const metadata = { title: `Role Details | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RoleFormView />
    </>
  );
}
