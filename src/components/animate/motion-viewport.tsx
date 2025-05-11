import { m } from 'framer-motion';
import { forwardRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { varContainer } from './variants';

export type TMotionViewportProps = BoxProps & {
  disableAnimate?: boolean;
};

export const MotionViewport = forwardRef(
  ({ children, disableAnimate = true, ...other }: TMotionViewportProps, ref) => {
    const smDown = useResponsive('down', 'sm');

    const disabled = smDown && disableAnimate;

    const props = disabled
      ? {}
      : {
          component: m.div,
          initial: 'initial',
          whileInView: 'animate',
          variants: varContainer(),
          viewport: { once: true, amount: 0.3 },
        };

    return (
      <Box ref={ref} {...props} {...other}>
        {children}
      </Box>
    );
  }
);
