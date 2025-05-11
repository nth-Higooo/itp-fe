import { Box, Card, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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
import { getLeaveInformationAsync } from 'src/services/leave/leave.service';
import dayjs from 'dayjs';
import { LeaveInformationTableRow } from './leave-information-table-row';
import { LeaveInformationTableToolbar } from './leave-information-table-toolbar';
import { PaginationItems } from 'src/components/pagination';

const TABLE_HEAD = [
  { id: 'employeeName', label: 'Employee Name' },
  { id: 'departments', label: 'Departments' },
  { id: 'totalAnnualLeave', label: 'Total Annual Leave' },
  { id: 'remainingAnnualLeave', label: 'Remaining Annual Leave' },
  { id: 'usedLeaves', label: 'Used Leaves' },
  { id: '', width: 132 },
];

export function LeaveInformationList() {
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();

  const table = useTable({
    defaultSortBy: 'name',
    defaultOrderBy: 'DESC',
    defaultRowsPerPage: 10,
  });

  const { leaveRequestList, leaveInformationList, count } = useAppSelector(selectLeave);

  const filters = useSetState({ search: '', year: '' });

  const fetchDataList = async () => {
    const { year, ...otherFilters } = filters.state;
    const requestParams = {
      ...otherFilters,
      ...(year ? { year } : {}),
      pageIndex: table.page + 1,
      pageSize: table.rowsPerPage,
      orderBy: table.order,
      sortBy: table.orderBy,
    };
    isLoading.onTrue();

    await dispatch(getLeaveInformationAsync(requestParams));
    isLoading.onFalse();
  };

  useEffect(() => {
    fetchDataList();
  }, [filters.state, table.page, table.rowsPerPage]);

  const handleYearFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedYear = event.target.value;
    filters.setState({ year: selectedYear });
    table.onResetPage();
  };
  return (
    <>
      <Card>
        <LeaveInformationTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          onYearChange={handleYearFilterChange}
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
                  leaveInformationList.map((row: any) => (
                    <LeaveInformationTableRow
                      refreshFunction={fetchDataList}
                      key={row.id}
                      row={row}
                    />
                  ))}
                {!isLoading.value && leaveInformationList.length === 0 && (
                  <>
                    <TableNoData notFound={!leaveInformationList.length} />
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
      </Card>
    </>
  );
}
