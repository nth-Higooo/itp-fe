import { TTheme } from 'src/theme/create-theme';
import { menuItem } from '../../styles';

// ----------------------------------------------------------------------

const MuiMenuItem = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }: { theme: TTheme }) => ({ ...menuItem(theme) }) },
};

// ----------------------------------------------------------------------

export const menu = { MuiMenuItem };
