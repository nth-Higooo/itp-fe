import { m } from 'framer-motion';
import { forwardRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

import { varContainer } from './variants';

export type TMotionContainerProps = BoxProps & {
  animate?: string;
  action?: boolean;
};

export const MotionContainer = forwardRef(
  ({ animate, action = false, children, ...other }: TMotionContainerProps, ref) => {
    const commonProps = {
      ref,
      component: m.div,
      variants: varContainer(),
      initial: action ? false : 'initial',
      animate: action ? (animate ? 'animate' : 'exit') : 'animate',
      exit: action ? undefined : 'exit',
      ...other,
    };

    return <Box {...commonProps}>{children}</Box>;
  }
);
