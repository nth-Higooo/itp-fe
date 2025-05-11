import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'src/components/snackbar';
import { _userList } from 'src/_mock';
import { Iconify } from 'src/components/iconify';

import { CONFIG } from 'src/config-global';
import { selectAuth } from 'src/redux/auth/auth.slice';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

import { EmployeeFormView } from 'src/sections/employee/view';
import { changeRequestAsync } from 'src/services/employee/employee.service';

// ----------------------------------------------------------------------

const metadata = { title: `Employee Details | ${CONFIG.appName}` };

export default function Page() {
  const { currentUser } = useAppSelector(selectAuth);
  const { employeeRequestChange } = useAppSelector(selectEmployees);
  const dispatch = useAppDispatch();

  const [canEdit, setCanEdit] = useState(false);

  const currentEmployee = useMemo(
    () =>
      currentUser.employee
        ? {
            ...currentUser.employee,
            user: {
              id: currentUser.id,
              email: currentUser.email,
              avatar: currentUser.avatar,
              displayName: currentUser.displayName,
              username: currentUser.username,
              createdAt: currentUser.createdAt,
              resetToken: currentUser.resetToken,
              roles: currentUser.roles,
              status: currentUser.status,
            },
          }
        : undefined,
    [currentUser]
  );

  const saveChangeAsync = async () => {
    try {
      const payload = {
        id: currentEmployee?.id,
        ...employeeRequestChange,
      };

      const response = await dispatch(changeRequestAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Change information successfully!');
        setCanEdit(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {currentEmployee ? (
        <EmployeeFormView
          currentEmployee={currentEmployee}
          canEdit={canEdit}
          role="Employee"
          action={
            !canEdit ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCanEdit(true)}
                startIcon={<Iconify icon="solar:pen-bold" />}
              >
                Request change
              </Button>
            ) : (
              <Stack spacing={1.5} direction="row" justifyContent="flex-end">
                <Button variant="outlined" color="inherit" onClick={() => setCanEdit(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" onClick={() => saveChangeAsync()}>
                  {'Save changes'}
                </LoadingButton>
              </Stack>
            )
          }
        />
      ) : (
        <></>
      )}
    </>
  );
}
