import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SetPasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = { title: `Set password | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SetPasswordView />
    </>
  );
}
