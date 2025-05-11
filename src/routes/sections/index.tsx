import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';

import dayjs from 'dayjs';
import { paths } from '../paths';
import { SimpleLayout } from 'src/layouts/simple';
import { lazy } from 'react';

// ----------------------------------------------------------------------

const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));

// ----------------------------------------------------------------------

export function Router() {
  const comingSoonDate = dayjs(CONFIG.comingSoon);
  if (comingSoonDate.isValid() && comingSoonDate.isAfter(dayjs())) {
    return useRoutes([
      {
        path: '*',
        element: <Navigate to={paths.main.comingSoon} replace />,
      },
      {
        path: paths.main.comingSoon,
        element: (
          <SimpleLayout content={{ compact: true }}>
            <ComingSoonPage />
          </SimpleLayout>
        ),
      },
    ]);
  }
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },
    {
      path: paths.main.comingSoon,
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,
  ]);
}
