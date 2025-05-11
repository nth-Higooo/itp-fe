import { ReactElement } from 'react';

import { Iconify } from 'src/components/iconify';

export type TAccountMenu = {
  label: string;
  href: string;
  icon: ReactElement;
  info?: string;
};

// ----------------------------------------------------------------------

export const _account: TAccountMenu[] = [
  {
    label: 'Change password',
    href: '/change-password',
    icon: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
  },
];
