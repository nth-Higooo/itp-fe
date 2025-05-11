import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ForgotPasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = { title: `Forgot password | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
