import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { NotificationGroupListView } from 'src/sections/notification-group/view';
// ----------------------------------------------------------------------

const metadata = { title: `Notification Group | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NotificationGroupListView />
    </>
  );
}
