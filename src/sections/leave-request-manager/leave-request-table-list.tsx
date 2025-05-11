import { Box, Card, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { DashboardContent } from 'src/layouts/dashboard';
import { selectLeave } from 'src/redux/leave/leave.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { getLeaveRequestManagerAsync } from 'src/services/leave/leave.service';
import dayjs from 'dayjs';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { getAllDepartmentsAsync, getAllLeaveTypeAsync } from 'src/services/selection.service';
import { LeaveManagerTableRow } from './leave-request-table-row';
import { LeaveManagerTableToolbar } from './leave-request-table-toolbar';

const TABLE_HEAD = [
  { id: 'employeeName', label: 'Employee' },
  { id: 'department', label: 'Department' },
  { id: 'leaveType', label: 'Type' },
  { id: 'dateRange', label: 'Date Range' },
  { id: 'noDays', label: 'Days' },
  { id: 'reason', label: 'Reason' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'comment', label: 'Comment' },
];

export function LeaveRequestListManager() {
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();

  const table = useTable({
    defaultSortBy: 'name',
    defaultOrderBy: 'DESC',
    defaultRowsPerPage: 10,
  });

  const { leaveRequestManager, count } = useAppSelector(selectLeave);
  const { leaveTypes, getAllLeaveTypeStatus, departments, getDepartmentStatus } =
    useAppSelector(selectSelections);
  const filters = useSetState({ month: '', leaveTypeId: '', departmentId: '', status: 'All' });

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getLeaveRequestManagerAsync({
        ...filters.state,
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
        orderBy: table.order,
        sortBy: table.orderBy,
      })
    );
    isLoading.onFalse();
  };

  const months = useMemo(() => {
    if (!leaveRequestManager || leaveRequestManager.length === 0) return [];

    const uniqueMonths = new Set(
      leaveRequestManager.map((request: any) => dayjs(request.startDate).format('MM'))
    );

    return Array.from(uniqueMonths).map((month) => ({
      id: month,
      name: month,
    }));
  }, [leaveRequestManager]);

  useEffect(() => {
    fetchDataList();
  }, [filters.state, table.page, table.rowsPerPage]);

  const handleMonthFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    filters.setState({ selectedMonth: event.target.value });
    table.onResetPage();
  };
  useEffect(() => {
    if (getAllLeaveTypeStatus === 'idle') {
      dispatch(getAllLeaveTypeAsync());
    }
    if (getDepartmentStatus === 'idle') {
      dispatch(getAllDepartmentsAsync());
    }
  }, [dispatch, getAllLeaveTypeStatus, getDepartmentStatus]);

  return (
    <DashboardContent>
      <Card>
        <LeaveManagerTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          optionsDepartments={departments}
          optionsLeaveTypes={leaveTypes}
          optionsMonth={months}
          onMonthChange={handleMonthFilterChange}
        />

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={table.rowsPerPage}
                onSort={table.onSort}
              />
              <TableBody>
                {!isLoading.value &&
                  leaveRequestManager.map((row: any) => (
                    <LeaveManagerTableRow key={row.id} row={row} />
                  ))}
                {!isLoading.value && leaveRequestManager.length === 0 && (
                  <>
                    <TableNoData notFound={!leaveRequestManager.length} />
                  </>
                )}

                {isLoading.value &&
                  Array(9)
                    .fill(9)
                    .map((_, index: number) => {
                      return (
                        <TableRow key={index}>
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

        <TablePaginationCustom
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
  );
}
