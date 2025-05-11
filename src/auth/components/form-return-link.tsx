import Link, { LinkProps } from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
export type TFormReturnLinkProps = LinkProps & {
  label?: any;
  icon?: any;
};

export function FormReturnLink({
  sx,
  href,
  children,
  label,
  icon,
  ...other
}: TFormReturnLinkProps) {
  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      variant="subtitle2"
      sx={{
        mt: 3,
        gap: 0.5,
        mx: 'auto',
        alignItems: 'center',
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      {icon || <Iconify width={16} icon="eva:arrow-ios-back-fill" />}
      {label || 'Return to sign in'}
    </Link>
  );
}
