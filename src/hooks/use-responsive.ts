import { useMemo } from 'react';

import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------

export function useResponsive(query: string, start: Breakpoint, end?: Breakpoint) {
  const theme = useTheme<TTheme>();

  const getQuery = useMemo(() => {
    switch (query) {
      case 'up':
        return theme.breakpoints.up(start);
      case 'down':
        return theme.breakpoints.down(start);
      case 'between':
        return theme.breakpoints.between(start, end!);
      case 'only':
        return theme.breakpoints.only(start);
      default:
        return theme.breakpoints.up('xs');
    }
  }, [theme, query, start, end]);

  const mediaQueryResult = useMediaQuery(getQuery);

  return mediaQueryResult;
}

// ----------------------------------------------------------------------

export function useWidth() {
  const theme = useTheme<TTheme>();

  const keys = useMemo(() => [...theme.breakpoints.keys].reverse(), [theme]);

  const width = keys.reduce((output: any, key: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = useMediaQuery(theme.breakpoints.up(key));

    return !output && matches ? key : output;
  }, null);

  return width || 'xs';
}
