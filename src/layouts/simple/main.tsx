import Box, { BoxProps } from '@mui/material/Box';
import { Breakpoint, useTheme } from '@mui/material/styles';

import { layoutClasses } from '../classes';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------
export type TMainProps = BoxProps;

export function Main({ children, sx, ...other }: TMainProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------
export type TCompactContentProps = BoxProps & {
  layoutQuery?: number | Breakpoint;
};

export function CompactContent({ sx, layoutQuery, children, ...other }: TCompactContentProps) {
  const theme = useTheme<TTheme>();

  return (
    <Box
      className={layoutClasses.content}
      sx={{
        width: 1,
        mx: 'auto',
        display: 'flex',
        flex: '1 1 auto',
        textAlign: 'center',
        flexDirection: 'column',
        p: theme.spacing(3, 2, 10, 2),
        maxWidth: 'var(--layout-simple-content-compact-width)',
        [theme.breakpoints.up(layoutQuery as Breakpoint)]: {
          justifyContent: 'center',
          p: theme.spacing(10, 0, 10, 0),
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
