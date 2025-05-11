import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Auth = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  ForgotPasswordPage: lazy(() => import('src/pages/auth/forgot-password')),
  NewPasswordPage: lazy(() => import('src/pages/auth/set-password')),
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'sign-in',
        element: (
          <GuestGuard>
            <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
              <Auth.SignInPage />
            </AuthSplitLayout>
          </GuestGuard>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestGuard>
            <AuthSplitLayout>
              <Auth.ForgotPasswordPage />
            </AuthSplitLayout>
          </GuestGuard>
        ),
      },
      {
        path: 'new-password/:resetToken',
        element: (
          <GuestGuard>
            <AuthSplitLayout>
              <Auth.NewPasswordPage />
            </AuthSplitLayout>
          </GuestGuard>
        ),
      },
    ],
  },
];
