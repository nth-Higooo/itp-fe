import { Box, Button, Card, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect } from 'react';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { selectLeave } from 'src/redux/leave/leave.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  deleteLeaveRequestAsync,
  getLeaveRequestListOfEmployeeAsync,
} from 'src/services/leave/leave.service';
import { LeaveRequestsListTableToolbar } from './leave-requests-list-toolbar';
import { Scrollbar } from 'src/components/scrollbar';
import { LeaveRequestListTableRow } from './leave-requests-table-row';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PaginationItems } from 'src/components/pagination';

const TABLE_HEAD = [
  { id: 'leaveType.name', label: 'Leave Type', minWidth: 300, sortable: true },
  { id: 'dateRange', label: 'Date Range', width: 300 },
  { id: 'numberOfDays', label: 'Number of days', width: 200 },
  { id: 'reason', label: 'Reason', width: 300 },
  { id: 'comment', label: 'Comment', width: 300 },
  { id: 'approver', label: 'Approver', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 132 },
];

export default function LeaveRequestList({ currentRequestId }: { currentRequestId?: string }) {
  const { leaveRequestListOfEmployee, leaveTypesOfEmployee } = useAppSelector(selectLeave);
  const table = useTable();

  const confirm = useBoolean();

  const confirmPermanentlyDelete = useBoolean();

  const selectedLeaveRequest = useSetState(null);

  const isLoading = useBoolean();

  const dispatch = useAppDispatch();

  const filters = useSetState({
    year: '',
    leaveTypeId: '',
  });

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getLeaveRequestListOfEmployeeAsync({
        ...filters.state,
        pageSize: table.rowsPerPage,
        pageIndex: table.page + 1,
      })
    );
    isLoading.onFalse();
  };
  useEffect(() => {
    fetchDataList();
  }, [table.page, table.rowsPerPage, table.order, table.orderBy, filters.state]);

  const handleDeleteRow = async (id: string) => {
    await dispatch(deleteLeaveRequestAsync(id));
    await fetchDataList();
    confirm.onFalse();
  };

  return (
    <>
      <Card sx={{ height: 'max-content' }}>
        <LeaveRequestsListTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          LeaveOptions={leaveTypesOfEmployee?.results}
        />

        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={Math.min(
              (leaveRequestListOfEmployee?.count || 0) - table.rowsPerPage * table.page,
              table.rowsPerPage
            )}
            onSelectAllRows={(checked: boolean) =>
              table.onSelectAllRows(
                checked,
                leaveRequestListOfEmployee?.leaveRequests.map((row: any) => row.id)
              )
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={Math.min(
                  (leaveRequestListOfEmployee?.count || 0) - table.rowsPerPage * table.page,
                  table.rowsPerPage
                )}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    leaveRequestListOfEmployee?.leaveRequests?.map((row: any) => row.id)
                  )
                }
              />

              <TableBody>
                {!isLoading.value &&
                  leaveRequestListOfEmployee?.leaveRequests?.map((row: any) => (
                    <LeaveRequestListTableRow
                      currentRequestId={currentRequestId}
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => {
                        confirm.onTrue();
                        selectedLeaveRequest.setState(row);
                      }}
                      onPermanentlyDeleteRow={() => {
                        confirmPermanentlyDelete.onTrue();
                        selectedLeaveRequest.setState(row);
                      }}
                    />
                  ))}

                {!isLoading.value && leaveRequestListOfEmployee?.leaveRequests.length === 0 && (
                  <>
                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        leaveRequestListOfEmployee?.leaveRequests.length
                      )}
                    />

                    <TableNoData notFound={!leaveRequestListOfEmployee?.leaveRequests.length} />
                  </>
                )}

                {isLoading.value &&
                  Array(5)
                    .fill(5)
                    .map((row: any) => {
                      return (
                        <TableRow>
                          <TableCell colSpan={9} align="center">
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
          count={leaveRequestListOfEmployee?.count}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
        <ConfirmDialog
          open={confirm.value}
          onClose={() => {
            confirm.onFalse();
            selectedLeaveRequest.onResetState();
          }}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteRow(selectedLeaveRequest.state.id)}
            >
              Delete
            </Button>
          }
        />
      </Card>
    </>
  );
}
