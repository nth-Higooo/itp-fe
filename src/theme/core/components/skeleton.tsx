import { TTheme } from 'src/theme/create-theme';
import { varAlpha } from '../../styles';

// ----------------------------------------------------------------------

const MuiSkeleton = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { animation: 'wave', variant: 'rounded' },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['400Channel'], 0.12),
    }),
    rounded: ({ theme }: { theme: TTheme }) => ({ borderRadius: theme.shape.borderRadius * 2 }),
  },
};

// ----------------------------------------------------------------------

export const skeleton = { MuiSkeleton };
