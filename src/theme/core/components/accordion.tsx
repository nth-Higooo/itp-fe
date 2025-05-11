import { accordionClasses } from '@mui/material/Accordion';
import { typographyClasses } from '@mui/material/Typography';
import { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------

const MuiAccordion = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({
      backgroundColor: 'transparent',
      [`&.${accordionClasses.expanded}`]: {
        boxShadow: theme.customShadows.z8,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.vars.palette.background.paper,
      },
      [`&.${accordionClasses.disabled}`]: { backgroundColor: 'transparent' },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiAccordionSummary = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: TTheme }) => ({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      [`&.${accordionSummaryClasses.disabled}`]: {
        opacity: 1,
        color: theme.vars.palette.action.disabled,
        [`& .${typographyClasses.root}`]: { color: 'inherit' },
      },
    }),
    expandIconWrapper: { color: 'inherit' },
  },
};

// ----------------------------------------------------------------------

export const accordion = { MuiAccordion, MuiAccordionSummary };
