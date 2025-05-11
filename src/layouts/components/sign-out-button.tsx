import { useCallback } from 'react';

import Button, { ButtonProps } from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { doLogout } from 'src/services/auth/auth.service';

// ----------------------------------------------------------------------
export type TSignOutButtonProps = ButtonProps & {
  onClose?: Function;
};

export function SignOutButton({ onClose, ...other }: TSignOutButtonProps) {
  const router = useRouter();

  const { checkUserSession }: any = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      doLogout();
      await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      color="error"
      onClick={handleLogout}
      {...other}
    >
      Logout
    </Button>
  );
}
