// ----------------------------------------------------------------------

import { TTheme } from 'src/theme/create-theme';

const MuiListItemIcon = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({
      color: 'inherit',
      minWidth: 'auto',
      marginRight: theme.spacing(2),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiListItemAvatar = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({ minWidth: 'auto', marginRight: theme.spacing(2) }),
  },
};

// ----------------------------------------------------------------------

const MuiListItemText = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { primaryTypographyProps: { typography: 'subtitle2' } },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { margin: 0 }, multiline: { margin: 0 } },
};

// ----------------------------------------------------------------------

export const list = {
  MuiListItemIcon,
  MuiListItemAvatar,
  MuiListItemText,
};
