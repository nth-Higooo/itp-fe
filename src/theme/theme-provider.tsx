import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';

import { createTheme } from './create-theme';
import { schemeConfig } from './scheme-config';
import { ReactNode } from 'react';

export type Mode = 'light' | 'dark' | 'system';
// ----------------------------------------------------------------------

export function ThemeProvider({ children }: { children: ReactNode }) {
  const settings = useSettingsContext();

  const theme = createTheme(settings);

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode={schemeConfig.defaultMode as Mode}
      modeStorageKey={schemeConfig.modeStorageKey}
    >
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
