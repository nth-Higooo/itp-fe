import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';
import { SimpleLayout } from 'src/layouts/simple';
import { paths } from '../paths';

// ----------------------------------------------------------------------

const Main = {
  Page403: lazy(() => import('src/pages/error/403')),
  Page404: lazy(() => import('src/pages/error/404')),
  Page500: lazy(() => import('src/pages/error/500')),
};

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: paths.main.error403,
        element: (
          <SimpleLayout content={{ compact: true }}>
            <Main.Page403 />
          </SimpleLayout>
        ),
      },
      {
        path: paths.main.error404,
        element: (
          <SimpleLayout content={{ compact: true }}>
            <Main.Page404 />
          </SimpleLayout>
        ),
      },
      {
        path: paths.main.error500,
        element: (
          <SimpleLayout content={{ compact: true }}>
            <Main.Page500 />
          </SimpleLayout>
        ),
      },
    ],
  },

  // No match
  { path: '*', element: <Navigate to={paths.main.error404} replace /> },
];
