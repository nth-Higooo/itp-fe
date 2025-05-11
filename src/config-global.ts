import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: 'ERP - Wata software',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  comingSoon: import.meta.env.VITE_COMING_SOON ?? '',
  auth: {
    skip: false,
    redirectPath: paths.dashboard.root,
  },
};
