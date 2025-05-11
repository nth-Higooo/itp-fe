import { createContext } from 'react';

// ----------------------------------------------------------------------

export type TAuthContext = {
  session: any;
  checkUserSession: any;
  loading: any;
  authenticated: any;
  unauthenticated: any;
};

export const AuthContext = createContext<TAuthContext | undefined>(undefined);

export const AuthConsumer = AuthContext.Consumer;
