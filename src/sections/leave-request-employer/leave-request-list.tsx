import {
  Box,
  Card,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
} from '@mui/material';
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
import {
  exportLeaveRequestEmployerAsync,
  getLeaveRequestByEmployerAsync,
} from 'src/services/leave/leave.service';
import { LeaveRequestTableRow } from './leave-request-table-row';
import { LeaveRequestTableToolbar } from './leave-request-table-toolbar';
import dayjs from 'dayjs';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { getAllLeaveTypeAsync } from 'src/services/selection.service';
import { useTabs } from 'src/hooks/use-tabs';
import { Iconify } from 'src/components/iconify';
import { LeaveInformationList } from './leave-information-list';
import { varAlpha } from 'src/theme/styles';
import { TTheme } from 'src/theme/create-theme';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationItems } from 'src/components/pagination';
import { ButtonExport } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';

const TABLE_HEAD = [
  { id: 'employeeName', label: 'Employee' },
  { id: 'department', label: 'Department' },
  { id: 'leaveType', label: 'Type' },
  { id: 'dateRange', label: 'Date Range' },
  { id: 'noDays', label: 'Days' },
  { id: 'reason', label: 'Reason' },
  { id: 'assignTo', label: 'Assigned To' },
  { id: 'status', label: 'Status' },
  { id: 'comment', label: 'Comment' },
];

// --------------------------------------------------------------------

export function LeaveRequestList() {
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();

  const table = useTable({
    defaultSortBy: 'name',
    defaultOrderBy: 'DESC',
    defaultRowsPerPage: 10,
  });

  const { leaveRequestList, count } = useAppSelector(selectLeave);
  const { leaveTypes, getAllLeaveTypeStatus } = useAppSelector(selectSelections);

  const filters = useSetState({ month: '', leaveTypeId: '' });

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getLeaveRequestByEmployerAsync({
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
    if (!leaveRequestList || leaveRequestList.length === 0) return [];

    const uniqueMonths = new Set(
      leaveRequestList.map((request: any) => dayjs(request.startDate).format('MM'))
    );

    return Array.from(uniqueMonths).map((month) => ({
      id: month,
      name: month,
    }));
  }, [leaveRequestList]);

  const exportPage = async () => {
    await dispatch(
      exportLeaveRequestEmployerAsync({
        ...filters.state,
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
      })
    );
  };
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
  }, [dispatch, getAllLeaveTypeStatus]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
      >
        <LeaveRequestTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          typeOptions={leaveTypes}
          monthOptions={months}
          onMonthChange={handleMonthFilterChange}
          exportPage={exportPage}
        />
        <ButtonExport
          permission={UserPermission.LEAVE_MANAGEMENT}
          label="Export Excel"
          props={{
            variant: 'contained',
            color: 'primary',
            onClick: () => exportPage(),
            startIcon: <Iconify icon="solar:export-bold" />,
          }}
        />
      </Stack>

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
                leaveRequestList.map((row: any) => <LeaveRequestTableRow key={row.id} row={row} />)}
              {!isLoading.value && leaveRequestList.length === 0 && (
                <>
                  <TableNoData notFound={!leaveRequestList.length} />
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

      <PaginationItems
        page={table.page}
        dense={table.dense}
        count={count}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </>
  );
}
