import { forwardRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------
export type TLogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef(
  (
    {
      width,
      href = '/',
      height,
      isSingle = true,
      disableLink = false,
      className,
      sx,
      ...other
    }: TLogoProps,
    ref
  ) => {
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src="https://res.cloudinary.com/dstmzshjs/image/upload/v1748369441/logo-single_dcobqx.png"
        // src={`${CONFIG.assetsDir}/logo/logo-single.png`}
        width="auto"
        height="100%"
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src="https://res.cloudinary.com/dstmzshjs/image/upload/v1748369441/logo-full_oeyizv.png"
        // src={`${CONFIG.assetsDir}/logo/logo-full.png`}
        width="auto"
        height="160%"
        sx={{
          // position: 'absolute',
          transform: 'translateX(20%) translateY(-10%)',
        }}
      />
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 202,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
