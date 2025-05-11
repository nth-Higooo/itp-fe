import Popover, { PopoverProps } from '@mui/material/Popover';
import { listClasses } from '@mui/material/List';
import { menuItemClasses } from '@mui/material/MenuItem';

import { calculateAnchorOrigin } from './utils';

// ----------------------------------------------------------------------
export type TCustomPopoverProps = PopoverProps & {
  anchorOrigin?: any;
  transformOrigin?: any;
  slotProps?: any;
};

export function CustomPopover({
  open,
  onClose,
  children,
  anchorEl,
  slotProps,
  ...other
}: TCustomPopoverProps) {
  const arrowPlacement = slotProps?.arrow?.placement ?? 'top-right';

  const { paperStyles, anchorOrigin, transformOrigin } = calculateAnchorOrigin(arrowPlacement);

  return (
    <Popover
      open={!!open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        ...slotProps,
        paper: {
          ...slotProps?.paper,
          sx: {
            ...paperStyles,
            overflow: 'inherit',
            [`& .${listClasses.root}`]: { minWidth: 140 },
            [`& .${menuItemClasses.root}`]: { gap: 2 },
            ...slotProps?.paper?.sx,
          },
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
