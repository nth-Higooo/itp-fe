import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { getRoleByIdAsync } from 'src/services/auth/role.service';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'src/routes/hooks';

import { RolePermissionsForm } from '../role-permissions-form';
import { selectRoles } from 'src/redux/auth/roles.slice';

// ----------------------------------------------------------------------

export function RoleFormView() {
  const dispatch = useAppDispatch();
  const { id = '' } = useParams();
  const { detailRole } = useAppSelector(selectRoles);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getRoleByIdAsync(id));
    };
    fetchData();
  }, [id]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs heading={`Permission of role: ${detailRole.name}`} />

        <Box display="flex" gap={5} flexDirection="column">
          <Grid container spacing={3}>
            <Grid xs={12}>
              <RolePermissionsForm />
            </Grid>
          </Grid>
        </Box>
      </DashboardContent>
    </>
  );
}
