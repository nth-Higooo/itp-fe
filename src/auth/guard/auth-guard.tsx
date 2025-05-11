import { useState, useEffect, useCallback, ReactNode } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { getAllItems } from 'src/layouts/components/searchbar/utils';
import { navData } from 'src/layouts/config-nav-dashboard';
import { hasViewPermission } from '../context';

// ----------------------------------------------------------------------

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const checkPermissions = () => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const href = `${paths.auth.signIn}?${createQueryString('returnTo', pathname)}`;

      router.replace(href);
      return;
    }

    const routeData = getAllItems({ data: navData });

    const requiredPermission = routeData.find((r: any) => r.path === pathname)?.permission;

    const hasPermission = hasViewPermission([requiredPermission]);

    if (!hasPermission) {
      router.replace(paths.main.error403);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, pathname]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
