// ----------------------------------------------------------------------

import { TTheme } from 'src/theme/create-theme';

const MuiTypography = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paragraph: ({ theme }: { theme: TTheme }) => ({ marginBottom: theme.spacing(2) }),
    gutterBottom: ({ theme }: { theme: TTheme }) => ({ marginBottom: theme.spacing(1) }),
  },
};

// ----------------------------------------------------------------------

export const typography = { MuiTypography };
