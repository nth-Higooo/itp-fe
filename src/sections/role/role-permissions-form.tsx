import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form } from 'src/components/hook-form';
import { initPermission, RoleRequest } from 'src/data/auth/role.model';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { toast } from 'src/components/snackbar';
import { getSystemPermissionsAsync, setPermissionsAsync } from 'src/services/auth/role.service';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { selectRoles } from 'src/redux/auth/roles.slice';
import { RolePermissionGroup } from './role-permission-group';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export type TRolePermissionsFormProps = {};

export function RolePermissionsForm({}: TRolePermissionsFormProps) {
  const dispatch = useAppDispatch();
  const isLoading = useBoolean();

  const { detailRole, systemPermissions, getSystemPermissionsStatus } = useAppSelector(selectRoles);

  const methods = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      permissions: Object.keys(systemPermissions || []).map((key) => {
        return {
          ...initPermission,
          permission: key,
        };
      }),
    },
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'permissions',
  });

  useEffect(() => {
    const roleForm = { ...detailRole };
    if (systemPermissions) {
      roleForm.permissions = Object.keys(systemPermissions).map((key) => {
        const index = roleForm.permissions.findIndex((p) => p.name === key);

        return index !== -1
          ? { ...roleForm.permissions[index], permission: key }
          : {
              ...initPermission,
              permission: key,
            };
      });
    }
    reset(roleForm);
  }, [detailRole, systemPermissions]);

  useEffect(() => {
    const fetchData = async () => {
      isLoading.onTrue();

      if (getSystemPermissionsStatus === 'idle') {
        await dispatch(getSystemPermissionsAsync());
      }
      isLoading.onFalse();
    };
    fetchData();
  }, []);

  const onSubmit = handleSubmit(async (data: RoleRequest) => {
    try {
      const response = await dispatch(setPermissionsAsync(data));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Update permissions successfully!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <Stack sx={{ p: 3 }}>
          <Box rowGap={3} columnGap={2} display="grid">
            {isLoading.value
              ? Array(5)
                  .fill(5)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width="100%"
                      height={60}
                      animation="wave"
                    />
                  ))
              : fields.map((permission, index) => (
                  <RolePermissionGroup
                    key={`${permission.id}`}
                    setValue={setValue}
                    index={index}
                    permission={permission}
                    control={control}
                  />
                ))}
          </Box>
        </Stack>
        <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3, pt: 0 }}>
          <Button LinkComponent={RouterLink} href={paths.user.role}>
            Back
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save changes
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}
