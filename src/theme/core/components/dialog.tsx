// ----------------------------------------------------------------------

import { TTheme } from 'src/theme/create-theme';

const MuiDialog = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({ ownerState, theme }: { theme: TTheme; ownerState: any }) => ({
      boxShadow: theme.customShadows.dialog,
      borderRadius: theme.shape.borderRadius * 2,
      ...(!ownerState.fullScreen && { margin: theme.spacing(2) }),
    }),
    paperFullScreen: { borderRadius: 0 },
  },
};

const MuiDialogTitle = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }: { theme: TTheme }) => ({ padding: theme.spacing(3) }) },
};

const MuiDialogContent = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({ padding: theme.spacing(0, 3) }),
    dividers: ({ theme }: { theme: TTheme }) => ({
      borderTop: 0,
      borderBottomStyle: 'dashed',
      paddingBottom: theme.spacing(3),
    }),
  },
};

const MuiDialogActions = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableSpacing: true },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({
      padding: theme.spacing(3),
      '& > :not(:first-of-type)': { marginLeft: theme.spacing(1.5) },
    }),
  },
};

// ----------------------------------------------------------------------

export const dialog = {
  MuiDialog,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogActions,
};
