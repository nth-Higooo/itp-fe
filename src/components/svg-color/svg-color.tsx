import { forwardRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

import { svgColorClasses } from './classes';

// ----------------------------------------------------------------------
type TSvgColorProps = BoxProps & {
  src: string;
};

export const SvgColor = forwardRef(
  ({ src, width = 24, height, className, sx, ...other }: TSvgColorProps, ref) => (
    <Box
      ref={ref}
      component="span"
      className={svgColorClasses.root.concat(className ? ` ${className}` : '')}
      sx={{
        width,
        flexShrink: 0,
        height: height ?? width,
        display: 'inline-flex',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  )
);
