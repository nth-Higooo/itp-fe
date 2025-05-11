import { Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { selectRoles } from 'src/redux/auth/roles.slice';
import { useAppSelector } from 'src/redux/store';
import { RoleRequest } from 'src/data/auth/role.model';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import { Button, ButtonBase, Collapse, FormControl, FormControlLabel } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';

type PermissionItem = {
  name: string;
  label: string;
};

export function RolePermissionGroup({
  permission,
  index,
  control,
  setValue,
}: {
  permission: any;
  index: number;
  control: any;
  setValue: any;
}) {
  const { systemPermissions } = useAppSelector(selectRoles);

  const permissionItems = (systemPermissions[permission.permission] || []) as PermissionItem[];

  const [checkedPermissionNames, setCheckedPermissionNames] = useState<string[]>(
    permissionItems
      .filter((item) => permission[item.name as keyof typeof permission])
      .map((item) => item.name)
  );

  // set form data
  useEffect(() => {
    permissionItems.forEach((item) => {
      setValue(
        `permissions.${index}[${item.name}]` as keyof RoleRequest,
        checkedPermissionNames.includes(item.name)
      );
    });
  }, [checkedPermissionNames, permissionItems, index, setValue]);

  const collapse = useBoolean();

  return (
    <Stack>
      <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: '0.375rem' }}>
        <Box>
          <FormLabel>{permission.permission}</FormLabel>
          <Checkbox
            disabled={permission.createdBy === 'migration'}
            indeterminate={
              checkedPermissionNames.length > 0 &&
              checkedPermissionNames.length !== permissionItems.length
            }
            onChange={(e) => {
              setCheckedPermissionNames(
                e.target.checked ? permissionItems.map((item) => item.name) : []
              );
            }}
            checked={
              checkedPermissionNames.length > 0 &&
              permissionItems.length === checkedPermissionNames.length
            }
          />
        </Box>
        {collapse.value ? (
          <ButtonBase onClick={collapse.onFalse}>
            <Iconify width={16} icon="eva:arrow-ios-upward-fill" />
          </ButtonBase>
        ) : (
          <ButtonBase onClick={collapse.onTrue}>
            <Iconify width={16} icon="eva:arrow-ios-downward-fill" />
          </ButtonBase>
        )}
      </Box>
      <Collapse in={collapse.value} timeout="auto" unmountOnExit>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            {permissionItems.map((item, idx) => (
              <Controller
                key={idx}
                control={control}
                name={`permissions.${index}[${item.name}]`}
                render={({ field: { value, onChange, ...restField } }) => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...restField}
                          color="primary"
                          disabled={permission.createdBy === 'migration'}
                          onChange={(e) => {
                            setCheckedPermissionNames(
                              e.target.checked
                                ? checkedPermissionNames.concat(item.name)
                                : checkedPermissionNames.filter((pName) => pName !== item.name)
                            );
                            onChange(e);
                          }}
                          checked={value}
                        />
                      }
                      label={item.label}
                    />
                  );
                }}
              />
            ))}
          </Box>
        </Card>
      </Collapse>
    </Stack>
  );
}
