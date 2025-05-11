import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList } from 'src/_mock';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
  TableNoData,
} from 'src/components/table';

import { selectEmployees } from 'src/redux/employee/employees.slice';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { getEmployeeByManagerAsync } from 'src/services/employee/employee.service';
import { getAllDepartmentsAsync, getAllPositionsWithLevels } from 'src/services/selection.service';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { EmployeeTableRow } from '../employee-table-row';
import { EmployeeTableToolbar } from '../employee-table-toolbar';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'departments', label: 'Department', width: 300 },
  { id: 'positions', label: 'Position', width: 180 },
  { id: 'contactInfo', label: 'Contact Information' },
];

// ----------------------------------------------------------------------

export function EmployeeListView() {
  const table = useTable({
    defaultSortBy: 'name',
    defaultOrderBy: 'DESC',
    defaultRowsPerPage: 10,
  });
  const { employeeListByManager, count } = useAppSelector(selectEmployees);
  const { departments, positionWithLevels, getPositionsStatus, getDepartmentStatus } =
    useAppSelector(selectSelections);
  const dispatch = useAppDispatch();
  const isLoading = useBoolean();

  useEffect(() => {
    if (getDepartmentStatus === 'idle') {
      dispatch(getAllDepartmentsAsync());
    }
  }, [dispatch, getDepartmentStatus]);

  useEffect(() => {
    if (getPositionsStatus === 'idle') {
      dispatch(getAllPositionsWithLevels());
    }
  }, [getPositionsStatus, dispatch]);

  const filters = useSetState({
    search: '',
    departmentId: '',
    positionId: '',
  });

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getEmployeeByManagerAsync({
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

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs heading="Employees" />

        <Card>
          <EmployeeTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            optionsDepartments={departments}
            optionsPositions={positionWithLevels}
          />

          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
                  onSort={table.onSort}
                />

                <TableBody>
                  {!isLoading.value &&
                    employeeListByManager.map((row: any) => (
                      <EmployeeTableRow key={row.id} row={row} />
                    ))}
                  {!isLoading.value && employeeListByManager.length === 0 && (
                    <>
                      <TableNoData notFound={!employeeListByManager.length} />
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
    </>
  );
}
