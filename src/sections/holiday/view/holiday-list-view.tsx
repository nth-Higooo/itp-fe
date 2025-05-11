import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/redux/store';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { selectHolidays } from 'src/redux/holiday/holiday.slice';
import { deleteHolidayAsync, getHolidaysAsync } from 'src/services/holiday/holiday.service';
import { HolidayTableRow } from '../holiday-table-row';
import { HolidayTableToolbar } from '../holiday-table-toolbar';
import { HolidayCreateForm } from '../holiday-create-form';
import { HolidayCloneForm } from '../holiday-clone-form';
import { toast } from 'src/components/snackbar';
import { UserPermission } from 'src/data/auth/role.model';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Holiday', minWidth: 300, sortable: true },
  { id: 'dateRange', label: 'Date Range' },
  { id: '', width: 80 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 2 }, (_, i) => currentYear + 1 - i).map((year) => ({
  id: year,
  name: year.toString(),
}));
// ----------------------------------------------------------------------

export function HolidayListView() {
  const isLoading = useBoolean();
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const createButton = useBoolean();
  const cloneButton = useBoolean();
  const confirmDelete = useBoolean();
  const selectedHoliday = useSetState(null);
  const dispatch = useAppDispatch();

  const filters = useSetState({ searchName: '', year: '' });

  const { holidayList, count } = useSelector(selectHolidays);

  const handleDeleteRow = async () => {
    try {
      await dispatch(deleteHolidayAsync(selectedHoliday.state.id));
      await fetchDataList();
      toast.success('Holiday deleted successfully!');
      confirmDelete.onFalse();
    } catch (error) {
      console.error('Failed to delete holiday:', error);
      toast.error('An error occurred while deleting the holiday.');
    }
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getHolidaysAsync({
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
        <CustomBreadcrumbs
          heading="Holidays"
          action={
            <Box gap={2} display="flex">
              <ButtonCreate
                permission={UserPermission.HOLIDAY_MANAGEMENT}
                label="New Holiday"
                props={{
                  variant: 'contained',
                  color: 'primary',
                  startIcon: <Iconify icon="mdi:plus" />,
                  onClick: () => createButton.onTrue(),
                }}
              />
              <ButtonCreate
                permission={UserPermission.HOLIDAY_MANAGEMENT}
                label="Clone"
                props={{
                  variant: 'contained',
                  color: 'inherit',
                  startIcon: <Iconify icon="mdi:content-copy" />,
                  onClick: () => cloneButton.onTrue(),
                }}
              />
            </Box>
          }
        />

        <HolidayCreateForm
          open={createButton.value}
          onClose={() => {
            createButton.onFalse();
            selectedHoliday.onResetState();
          }}
          fetchDataList={fetchDataList}
        />
        <HolidayCloneForm
          open={cloneButton.value}
          onClose={() => {
            cloneButton.onFalse();
            selectedHoliday.onResetState();
          }}
          fetchDataList={fetchDataList}
        />

        <Card>
          <HolidayTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ years }}
          />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  holidayList.map((row: any) => row.id)
                )
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 720, alignItems: 'center' }}
              >
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
                      holidayList.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    holidayList.map((row: any) => (
                      <HolidayTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedHoliday.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && holidayList.length === 0 && (
                    <>
                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, holidayList.length)}
                      />

                      <TableNoData notFound={!holidayList.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(4)
                      .fill(4)
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
          selectedHoliday.onResetState();
        }}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
