// ----------------------------------------------------------------------

import {
  Box,
  Button,
  Card,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { selectLeave } from 'src/redux/leave/leave.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { deleteLeaveTypeAsync, getLeaveTypeAsync } from 'src/services/leave/leave.service';
import { LeaveTypeCreateEditForm } from '../leave-type-create-edit-form';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LeaveTypeTableRow } from '../leave-type-table-row';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'regulationQuantity', label: 'Regulation Quantity', width: 260 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function LeaveTypeListView() {
  const { leaveTypeList } = useAppSelector(selectLeave);
  const table = useTable();
  const confirm = useBoolean();
  const confirmDeleteRows = useBoolean();
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();
  const create = useBoolean();

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getLeaveTypeAsync({
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
  }, [table.page, table.rowsPerPage, table.order, table.orderBy]);

  const handleDeleteRow = async (id?: string) => {
    if (id) {
      await dispatch(deleteLeaveTypeAsync(id));
      confirm.onFalse();
    } else {
      table.selected.map(async (id: any) => {
        dispatch(deleteLeaveTypeAsync(id));
      });
      table.onResetPage();
      confirmDeleteRows.onFalse();
    }
    fetchDataList();
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Leave Types"
          action={
            <ButtonCreate
              permission={UserPermission.LEAVE_TYPE_MANAGEMENT}
              label="New Leave Type"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => create.onTrue(),
              }}
            />
          }
        />

        <LeaveTypeCreateEditForm
          open={create.value}
          onClose={create.onFalse}
          resetFunction={fetchDataList}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(
                leaveTypeList.count - table.rowsPerPage * table.page,
                table.rowsPerPage
              )}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  leaveTypeList.leaveTypes.map((row: any) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDeleteRows.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Math.min(
                    leaveTypeList.count - table.rowsPerPage * table.page,
                    table.rowsPerPage
                  )}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      leaveTypeList.leaveTypes.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    leaveTypeList.leaveTypes.map((row: any) => (
                      <LeaveTypeTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        resetFunction={fetchDataList}
                      />
                    ))}

                  {!isLoading.value && leaveTypeList.leaveTypes.length === 0 && (
                    <>
                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, leaveTypeList.count)}
                      />
                      <TableNoData notFound={!leaveTypeList.leaveTypes.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(8)
                      .fill(9)
                      .map((_, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell colSpan={4} align="center">
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
            count={leaveTypeList.count}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
        <ConfirmDialog
          open={confirmDeleteRows.value}
          onClose={confirmDeleteRows.onFalse}
          title="Delete"
          content={
            <>
              Are you sure want to delete <strong> {table.selected.length} </strong> items?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteRow();
                confirmDeleteRows.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </DashboardContent>
    </>
  );
}
