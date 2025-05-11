import { listClasses } from '@mui/material/List';

import { paper } from '../../styles';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------

const MuiPopover = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({ theme }: { theme: TTheme }) => ({
      ...paper({ theme, dropdown: true }),
      [`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 },
    }),
  },
};

// ----------------------------------------------------------------------

export const popover = { MuiPopover };
