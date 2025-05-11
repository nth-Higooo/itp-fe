// ----------------------------------------------------------------------

import { TTheme } from 'src/theme/create-theme';

const MuiTreeItem = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    label: ({ theme }: { theme: TTheme }) => ({ ...theme.typography.body2 }),
    iconContainer: { width: 'auto' },
  },
};

// ----------------------------------------------------------------------

export const treeView = { MuiTreeItem };
