import { useMemo, useEffect, useCallback, ReactNode } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { AuthContext } from './auth-context';
import { isValidToken } from './utils';
import TokenService from 'src/services/token.service';
import { useAppDispatch } from 'src/redux/store';
import { getCurrentUserAsync } from 'src/services/auth/auth.service';

// ----------------------------------------------------------------------
export type TAuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: TAuthProviderProps) {
  const dispatch = useAppDispatch();

  const { state, setState } = useSetState({
    session: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = TokenService.getToken();

      if (accessToken && isValidToken(accessToken)) {
        await dispatch(getCurrentUserAsync());

        setState({ session: TokenService.getSession(), loading: false });
      } else {
        setState({ session: null, loading: false });
      }
    } catch (error) {
      setState({ session: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.session ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      session: state.session,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.session, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
