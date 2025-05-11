// ----------------------------------------------------------------------

import { Box, Button, Card, IconButton, Stack, Table, TableBody, Tooltip } from '@mui/material';
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
import {
  deleteLeaveTypeAsync,
  getLeaveTypeAsync,
  getLeaveTypeOfEmployeeAsync,
} from 'src/services/leave/leave.service';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LeaveTypeTableRow } from './leave-type-table-row';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { LeaveTypeCreateEditForm } from './leave-request-form';
import { selectAuth } from 'src/redux/auth/auth.slice';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 150},
  { id: 'regulationQuantity', label: 'Regulation Quantity', width: 100},
];

// ----------------------------------------------------------------------

export function LeaveRegulationOfEmployeeView() {
  const table = useTable();
  const { leaveTypesOfEmployee } = useAppSelector(selectLeave);
  const { currentUser } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const fetchDataList = async () => {
    if (currentUser.employee?.id) {
      await dispatch(getLeaveTypeOfEmployeeAsync(currentUser.employee?.id));
    }
  };
  useEffect(() => {
    fetchDataList();
  }, [table.page, table.rowsPerPage, table.order, table.orderBy]);
  return (
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ display: 'flex'}}>
        <Card sx={{ scrollbarColor:'inherit', height:'max-content' , width:{xs:'100%',md:'40%'}, flexShrink:0}}>
          <Scrollbar>
          <Box>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(
                (leaveTypesOfEmployee?.count || 0) - table.rowsPerPage * table.page,
                table.rowsPerPage
              )}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  leaveTypesOfEmployee?.results.map((row: any) => row.id)
                )
              }
            />
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 400 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                disabledCheckbox={true}
                headLabel={TABLE_HEAD}
                rowCount={Math.min(
                  (leaveTypesOfEmployee?.count || 0) - table.rowsPerPage * table.page,
                  table.rowsPerPage
                )}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    leaveTypesOfEmployee?.results.map((row: any) => row.id)
                  )
                }
              />

              <TableBody>
                {leaveTypesOfEmployee?.results.map((row: any) => (
                  <LeaveTypeTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                  />
                ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, leaveTypesOfEmployee?.count)}
                />
              </TableBody>
              <TableNoData notFound={!leaveTypesOfEmployee?.results.length} />
            </Table>
          </Box>
          </Scrollbar>
        </Card>
        <Box sx={{width:{xs:'100%', md:'50%' }}}>
        <LeaveTypeCreateEditForm />
        </Box>

      </Stack>
 
  );
}
