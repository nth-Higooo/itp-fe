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
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { TTheme } from 'src/theme/create-theme';
import { UserCreateEditForm } from '../user-create-edit-form';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectUsers } from 'src/redux/auth/users.slice';
import {
  countUserSeparatedStatusAsync,
  deleteUserAsync,
  getUsersAsync,
  permanentlyDeleteUserAsync,
  resendEmailSetPasswordAsync,
  restoreUserAsync,
} from 'src/services/auth/user.service';
import { getAllRolesAsync } from 'src/services/selection.service';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { UserStatus } from 'src/data/auth/user.model';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';
import { useLocation, useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: UserStatus.ACTIVE, label: 'Active' },
  { value: UserStatus.PENDING, label: 'Pending' },
  { value: UserStatus.DISABLED, label: 'Disabled' },
  { value: 'TRASH', label: 'Trash' },
];

const TABLE_HEAD = [
  { id: 'displayName', label: 'Name', minWidth: 300, sortable: true },
  { id: 'roles', label: 'Roles', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 132 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const isLoading = useBoolean();
  const table = useTable({
    defaultOrderBy: 'displayName',
    defaultRowsPerPage: 10,
  });
  const resendEmail = useBoolean();
  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const confirmRestore = useBoolean();
  const confirmPermanentlyDelete = useBoolean();
  const selectedUser = useSetState(null);

  const filters = useSetState({ name: '', role: '', status: 'ALL' });

  const location = useLocation();
  const navigate = useNavigate();

  const handleFilterStatus = useCallback(
    (event: any, newValue: any) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const { userList, count, countAllStatus } = useAppSelector(selectUsers);
  const { roles } = useAppSelector(selectSelections);
  const dispatch = useAppDispatch();

  const handleDeleteRow = async () => {
    await dispatch(deleteUserAsync(selectedUser.state.id));
    await dispatch(countUserSeparatedStatusAsync());
    await fetchDataList();
    confirmDelete.onFalse();
    selectedUser.onResetState();
  };

  const handleResendRow = async () => {
    await dispatch(resendEmailSetPasswordAsync(selectedUser.state.id));
    resendEmail.onFalse();
  };

  const handleRestoreRow = async () => {
    await dispatch(restoreUserAsync(selectedUser.state.id));
    await dispatch(countUserSeparatedStatusAsync());
    await fetchDataList();
    confirmRestore.onFalse();
    selectedUser.onResetState();
  };

  const handlePermanentlyDeleteRow = async () => {
    await dispatch(permanentlyDeleteUserAsync(selectedUser.state.id));
    await dispatch(countUserSeparatedStatusAsync());
    await fetchDataList();
    confirmPermanentlyDelete.onFalse();
    selectedUser.onResetState();
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getUsersAsync({
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
      await dispatch(countUserSeparatedStatusAsync());
      await dispatch(getAllRolesAsync());
    };
    fetchData();
  }, []);

  useEffect(() => {
    const userId = location.pathname.split('/').pop();
    if (userId) {
      table.setRowsPerPage(count);
      const user = userList.find((user) => user.id === userId);
      if (user) {
        selectedUser.setState(user);
        createEdit.onTrue();
      }
    }
  }, [location, userList, selectedUser, createEdit]);

  const handleOnCloseCreateEdit = async (isSubmit: boolean = false) => {
    if (isSubmit) {
      await dispatch(countUserSeparatedStatusAsync());
      await fetchDataList();
    }
    createEdit.onFalse();
    selectedUser.onResetState();
    navigate('/users');
    table.setRowsPerPage(10);
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Users"
          action={
            <ButtonCreate
              permission={UserPermission.USER_MANAGEMENT}
              label="New User"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => createEdit.onTrue(),
              }}
            />
          }
        />

        <UserCreateEditForm
          currentUser={selectedUser.state}
          open={createEdit.value}
          onClose={handleOnCloseCreateEdit}
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
                    color={
                      (tab.value === 'ALL' && 'primary') ||
                      (tab.value === UserStatus.ACTIVE && 'success') ||
                      (tab.value === UserStatus.PENDING && 'warning') ||
                      (tab.value === UserStatus.DISABLED && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'ALL' && countAllStatus.total}
                    {tab.value === UserStatus.ACTIVE && countAllStatus.totalActive}
                    {tab.value === UserStatus.PENDING && countAllStatus.totalPending}
                    {tab.value === UserStatus.DISABLED && countAllStatus.totalDisabled}
                    {tab.value === 'TRASH' && countAllStatus.totalDeleted}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar filters={filters} onResetPage={table.onResetPage} options={{ roles }} />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  userList.map((row: any) => row.id)
                )
              }
              action={
                <>
                  {filters.state.status === UserStatus.PENDING && (
                    <Tooltip title="Resend" placement="top" arrow>
                      <IconButton color="default" onClick={() => {}}>
                        <Iconify icon="solar:plain-bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete" placement="top" arrow>
                    <IconButton color="primary" onClick={() => {}}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
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
                      userList.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    userList.map((row: any) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onResendRow={() => {
                          resendEmail.onTrue();
                          selectedUser.setState(row);
                        }}
                        onEditRow={() => {
                          createEdit.onTrue();
                          selectedUser.setState(row);
                        }}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedUser.setState(row);
                        }}
                        onRestoreRow={() => {
                          confirmRestore.onTrue();
                          selectedUser.setState(row);
                        }}
                        onPermanentlyDeleteRow={() => {
                          confirmPermanentlyDelete.onTrue();
                          selectedUser.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && userList.length === 0 && (
                    <>
                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, userList.length)}
                      />

                      <TableNoData notFound={!userList.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(5)
                      .fill(5)
                      .map((_, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell colSpan={5} align="center">
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
        open={resendEmail.value}
        onClose={() => {
          resendEmail.onFalse();
          selectedUser.onResetState();
        }}
        title="Resend"
        content="Are you sure want to resend?"
        action={
          <Button variant="contained" color="info" onClick={handleResendRow}>
            Resend
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedUser.onResetState();
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
          selectedUser.onResetState();
        }}
        title="Restore"
        content="Are you sure want to restore?"
        action={
          <Button variant="contained" color="success" onClick={handleRestoreRow}>
            Restore
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmPermanentlyDelete.value}
        onClose={() => {
          confirmPermanentlyDelete.onFalse();
          selectedUser.onResetState();
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
