import { useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { RoleTableRow } from '../role-table-row';
import { TTheme } from 'src/theme/create-theme';
import { RoleCreateEditForm } from '../role-create-edit-form';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  countRoleSeparatedStatusAsync,
  deleteRoleAsync,
  getRolesAsync,
  permanentlyDeleteRoleAsync,
  restoreRoleAsync,
} from 'src/services/auth/role.service';
import { selectRoles } from 'src/redux/auth/roles.slice';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { toast } from 'src/components/snackbar';
import { PaginationItems } from 'src/components/pagination';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'TRASH', label: 'Trash' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Role', width: 180, sortable: true },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'totalUser', label: 'User', width: 100 },
  { id: '', width: 132 },
];

// ----------------------------------------------------------------------

export function RoleListView() {
  const isLoading = useBoolean();
  const router = useRouter();
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const confirmRestore = useBoolean();
  const confirmPermanentlyDelete = useBoolean();
  const selectedRole = useSetState(null);

  const filters = useSetState({ status: 'ALL' });

  const handleFilterStatus = useCallback(
    (event: any, newValue: any) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const { roleList, count, countAllStatus } = useAppSelector(selectRoles);
  const dispatch = useAppDispatch();

  const handleDeleteRow = async () => {
    await dispatch(deleteRoleAsync(selectedRole.state.id));
    toast.success('Delete role successfully!');
    await dispatch(countRoleSeparatedStatusAsync());
    await fetchDataList();
    confirmDelete.onFalse();
  };

  const handleRestoreRow = async () => {
    await dispatch(restoreRoleAsync(selectedRole.state.id));
    await dispatch(countRoleSeparatedStatusAsync());
    await fetchDataList();
    confirmRestore.onFalse();
  };

  const handlePermanentlyDeleteRow = async () => {
    await dispatch(permanentlyDeleteRoleAsync(selectedRole.state.id));
    await dispatch(countRoleSeparatedStatusAsync());
    await fetchDataList();
    confirmPermanentlyDelete.onFalse();
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getRolesAsync({
        ...filters.state,
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
        orderBy: table.order,
        sortBy: table.orderBy,
      })
    );
    isLoading.onFalse();
  };

  useEffect(() => {
    fetchDataList();
  }, [filters.state, table.page, table.rowsPerPage, table.orderBy, table.order]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(countRoleSeparatedStatusAsync());
    };
    fetchData();
  }, []);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Roles"
          action={
            <Button
              onClick={createEdit.onTrue}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New role
            </Button>
          }
        />

        <RoleCreateEditForm
          currentRole={selectedRole.state}
          open={createEdit.value}
          onClose={() => {
            createEdit.onFalse();
            selectedRole.onResetState();
          }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme: TTheme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={(tab.value === 'ALL' && 'primary') || 'default'}
                  >
                    {tab.value === 'ALL' && countAllStatus.total}
                    {tab.value === 'TRASH' && countAllStatus.totalDeleted}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  roleList.map((row: any) => row.id)
                )
              }
              action={<></>}
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 600 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      roleList.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    roleList.map((row: any) => (
                      <RoleTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDetailsRow={() => {
                          router.push(paths.user.roleDetails(row.id));
                        }}
                        onEditRow={() => {
                          createEdit.onTrue();
                          selectedRole.setState(row);
                        }}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedRole.setState(row);
                        }}
                        onRestoreRow={() => {
                          confirmRestore.onTrue();
                          selectedRole.setState(row);
                        }}
                        onPermanentlyDeleteRow={() => {
                          confirmPermanentlyDelete.onTrue();
                          selectedRole.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && roleList.length === 0 && (
                    <>
                      <TableNoData notFound={!roleList.length} />
                    </>
                  )}
                  {isLoading.value &&
                    Array(7)
                      .fill(7)
                      .map((_, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell colSpan={7} align="center">
                              <Skeleton variant="rounded" width={'100%'} height={60} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <PaginationItems
            page={table.page}
            dense={table.dense}
            count={count}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedRole.onResetState();
        }}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmRestore.value}
        onClose={() => {
          confirmRestore.onFalse();
          selectedRole.onResetState();
        }}
        title="Restore"
        content="Are you sure want to restore?"
        action={
          <Button variant="contained" color="error" onClick={handleRestoreRow}>
            Restore
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmPermanentlyDelete.value}
        onClose={() => {
          confirmPermanentlyDelete.onFalse();
          selectedRole.onResetState();
        }}
        title="Permanently Delete"
        content="Are you sure want to permanently delete?"
        action={
          <Button variant="contained" color="error" onClick={handlePermanentlyDeleteRow}>
            Permanently Delete
          </Button>
        }
      />
    </>
  );
}
