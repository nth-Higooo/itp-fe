import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { SkillTypeListView } from 'src/sections/skill-type/view';

// ----------------------------------------------------------------------

const metadata = { title: `Leave Types | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SkillTypeListView />
    </>
  );
}
