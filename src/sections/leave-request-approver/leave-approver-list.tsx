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
import { selectLeave, selectLeaveId } from 'src/redux/leave/leave.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { getLeaveRequestApproverAsync, getLeaveRequestByIdAsync } from 'src/services/leave/leave.service';
import dayjs from 'dayjs';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { getAllLeaveTypeAsync } from 'src/services/selection.service';
import { LeaveApproverTableRow } from './leave-approver-table-row';
import { LeaveApproverTableToolbar } from './leave-approver-toolbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaginationItems } from 'src/components/pagination';
import { LeaveApproverEditForm } from './leave-approver-edit-form';
import { LeaveRequestStatus } from 'src/data/leave/leave.model';

const TABLE_HEAD = [
  { id: 'name', label: 'Employee'},
  { id: 'leaveType', label: 'Type' },
  { id: 'dateRange', label: 'Date Range' },
  { id: 'noDays', label: 'Days' },
  { id: 'reason', label: 'Reason' },
  { id: 'confirmed', label: 'Confirmed'},
  { id: 'comment', label: 'Comment' },
  { id: '', label: '' },
];

export function LeaveRequestListApprover() {
  const isLoading = useBoolean();

  const quickEdit = useBoolean();

  const dispatch = useAppDispatch();

  const table = useTable({
    defaultOrderBy: 'DESC',
    defaultRowsPerPage: 10,
  });

  const { leaveRequestApprover, count, selectedLeaveRequest, selectedLeaveRequestObject} = useAppSelector(selectLeave);
  const { leaveTypes, getAllLeaveTypeStatus } = useAppSelector(selectSelections);

  const filters = useSetState({ month: '', leaveTypeId: '' });

  const fetchCurrentLeaveRequest = async () => {
    if (selectedLeaveRequest) {
      const response = await dispatch(getLeaveRequestByIdAsync(selectedLeaveRequest));
      if (response.meta.requestStatus === 'fulfilled') {
        quickEdit.onTrue();
      }
    }
  };

  useEffect(() => {
    if (!!selectedLeaveRequest){
      fetchCurrentLeaveRequest();
    } else {
      quickEdit.onFalse();
    }
  }, [selectedLeaveRequest]);


  const handleClose = () => {
    dispatch(selectLeaveId(null));
    quickEdit.onFalse();
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getLeaveRequestApproverAsync({
        ...filters.state,
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
      })
    );
    isLoading.onFalse();
  };

  const months = useMemo(() => {
    if (!leaveRequestApprover || leaveRequestApprover.length === 0) return [];

    const uniqueMonths = new Set(
      leaveRequestApprover.map((request: any) => dayjs(request.startDate).format('MM'))
    );

    return Array.from(uniqueMonths).map((month) => ({
      id: month,
      name: month,
    }));
  }, [leaveRequestApprover]);

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
    <DashboardContent>
      <CustomBreadcrumbs heading="Leave Request" />

      <Card>
        <LeaveApproverTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          typeOptions={leaveTypes}
          monthOptions={months}
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
                  leaveRequestApprover.map((row: any) => (
                    <LeaveApproverTableRow refreshFunction={fetchDataList} key={row.id} row={row} />
                  ))}
                {!isLoading.value && leaveRequestApprover.length === 0 && (
                  <>
                    <TableNoData notFound={!leaveRequestApprover.length} />
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
          {selectedLeaveRequestObject && (
             <LeaveApproverEditForm currentRequest={selectedLeaveRequestObject} onRefresh={fetchDataList} open={quickEdit.value} canViewDays={quickEdit.value} onClose={handleClose} />
          )}
         
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
  );
}
