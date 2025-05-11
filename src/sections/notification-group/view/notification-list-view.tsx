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

import { TTheme } from 'src/theme/create-theme';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { UserStatus } from 'src/data/auth/user.model';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';
import { NotificationGroupCreateEditForm } from '../notification-group-create-edit-form';
import { NotificationGroupTableRow } from '../notification-group-table-row';
import { deleteNotificationAsync } from 'src/services/notification.service';
import {
  deleteNotificationGroupAsync,
  getNotificationGroupMembersAsync,
  getNotificationGroupsAsync,
  permanentlyDeleteNotificationGroupAsync,
  restoreNotificationGroupAsync,
} from 'src/services/notification-group/notification-group.service';
import { toast } from 'src/components/snackbar';
import { selectNotificationGroups } from 'src/redux/notification-group/notification-group.slice';
import { NotificationGroupTableToolbar } from '../notification-group-toolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: UserStatus.ACTIVE, label: 'Active' },
  { value: UserStatus.PENDING, label: 'Pending' },
  { value: UserStatus.DISABLED, label: 'Disabled' },
  { value: 'TRASH', label: 'Trash' },
];

const TABLE_HEAD = [
  { id: 'type', label: 'Type', minWidth: 200 },
  { id: 'members', label: 'Members', minWidth: 400 },
  { id: '', width: 132 },
];

// ----------------------------------------------------------------------

export function NotificationGroupListView() {
  const isLoading = useBoolean();
  const table = useTable({
    defaultOrderBy: 'type',
    defaultRowsPerPage: 10,
  });
  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const selectedNotificationGroup = useSetState(null);

  const filters = useSetState({ memberName: '', type: '' });

  const { notificationGroups, count } = useAppSelector(selectNotificationGroups);
  const dispatch = useAppDispatch();

  const handleDeleteRow = async () => {
    const response = await dispatch(
      deleteNotificationGroupAsync(selectedNotificationGroup.state.id)
    );
    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Delete notification group successfully!');
    }
    await fetchDataList();
    confirmDelete.onFalse();
    selectedNotificationGroup.onResetState();
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getNotificationGroupsAsync({
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
      await dispatch(getNotificationGroupMembersAsync());
    };
    fetchData();
  }, []);

  const handleOnCloseCreateEdit = async (isSubmit: boolean = false) => {
    if (isSubmit) {
      await fetchDataList();
    }
    createEdit.onFalse();
    selectedNotificationGroup.onResetState();
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Notification Groups"
          action={
            <ButtonCreate
              permission={UserPermission.GROUP_NOTIFICATION_MANAGEMENT}
              label="New Notification Group"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => createEdit.onTrue(),
              }}
            />
          }
        />

        <NotificationGroupCreateEditForm
          currentNotificationGroup={selectedNotificationGroup.state}
          open={createEdit.value}
          onClose={handleOnCloseCreateEdit}
        />

        <NotificationGroupTableToolbar filters={filters} onResetPage={table.onResetPage} />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  notificationGroups.map((row: any) => row.id)
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
                      notificationGroups.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    notificationGroups.map((row: any) => (
                      <NotificationGroupTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => {
                          createEdit.onTrue();
                          selectedNotificationGroup.setState(row);
                        }}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedNotificationGroup.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && notificationGroups.length === 0 && (
                    <>
                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(
                          table.page,
                          table.rowsPerPage,
                          notificationGroups.length
                        )}
                      />

                      <TableNoData notFound={!notificationGroups.length} />
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
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedNotificationGroup.onResetState();
        }}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
