import Box, { BoxProps } from '@mui/material/Box';
import { Breakpoint, useTheme } from '@mui/material/styles';

import { layoutClasses } from 'src/layouts/classes';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------
export type TMainProps = BoxProps & {
  layoutQuery: number | Breakpoint;
};

export function Main({ sx, children, layoutQuery, ...other }: TMainProps) {
  const theme = useTheme<TTheme>();

  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        [theme.breakpoints.up(layoutQuery)]: {
          flexDirection: 'row',
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------
export type TContentProps = BoxProps & {
  layoutQuery: number | Breakpoint;
};

export function Content({ sx, children, layoutQuery, ...other }: TContentProps) {
  const theme = useTheme<TTheme>();

  const renderContent = (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 'var(--layout-auth-content-width)',
      }}
    >
      {children}
    </Box>
  );

  return (
    <Box
      className={layoutClasses.content}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        alignItems: 'center',
        flexDirection: 'column',
        p: theme.spacing(3, 2, 10, 2),
        [theme.breakpoints.up(layoutQuery)]: {
          justifyContent: 'center',
          p: theme.spacing(10, 2, 10, 2),
        },
        ...sx,
      }}
      {...other}
    >
      {renderContent}
    </Box>
  );
}
