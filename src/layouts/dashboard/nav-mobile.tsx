import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { NavSectionVertical, TNavSectionVerticalProps } from 'src/components/nav-section';

// ----------------------------------------------------------------------
export type TNavMobileProps = TNavSectionVerticalProps & {
  open?: any;
  onClose?: any;
  slots?: any;
};

export function NavMobile({ data, open, onClose, slots, sx, ...other }: TNavMobileProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo isSingle={false} width="auto" />
        </Box>
      )}

      <Scrollbar fillContent={true}>
        <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
