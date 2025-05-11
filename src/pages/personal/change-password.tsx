import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ChangePasswordView } from 'src/sections/personal/view';

// ----------------------------------------------------------------------

const metadata = { title: `Change password | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
