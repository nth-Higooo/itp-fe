// ----------------------------------------------------------------------

import { TTheme } from 'src/theme/create-theme';

const MuiBreadcrumbs = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    ol: ({ theme }: { theme: TTheme }) => ({
      rowGap: theme.spacing(0.5),
      columnGap: theme.spacing(2),
    }),

    li: ({ theme }: { theme: TTheme }) => ({
      display: 'inline-flex',
      '& > *': { ...theme.typography.body2 },
    }),
    separator: { margin: 0 },
  },
};

// ----------------------------------------------------------------------

export const breadcrumbs = { MuiBreadcrumbs };
