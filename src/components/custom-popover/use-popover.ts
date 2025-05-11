import { useState, useCallback, SetStateAction } from 'react';

// ----------------------------------------------------------------------

export function usePopover() {
  const [anchorEl, setAnchorEl] = useState(null);

  const onOpen = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    open: !!anchorEl,
    anchorEl,
    onOpen,
    onClose,
    setAnchorEl,
  };
}
