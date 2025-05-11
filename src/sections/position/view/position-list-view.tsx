import { useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

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
  TablePaginationCustom,
} from 'src/components/table';
import { toast } from 'src/components/snackbar';

import { PositionTableRow } from '../position-table-row';
import { PositionTableToolbar } from '../position-table-toolbar';
import { PositionCreateEditForm } from '../position-create-edit-form';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { deletePositionAsync, getPositionsAsync } from 'src/services/employer/position.service';
import { selectPositions } from 'src/redux/employer/positions.slice';
import { Position } from 'src/data/employer/position.model';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { getPermissions } from 'src/services/token.service';
import { UserPermission } from 'src/data/auth/role.model';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'levels', label: 'Levels', width: 180 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PositionListView() {
  const table = useTable();

  const { positionList, count } = useAppSelector(selectPositions);

  const create = useBoolean();

  const isLoading = useBoolean();

  const dispatch = useAppDispatch();

  const confirm = useBoolean();

  const confirmDeleteRows = useBoolean();

  const filters = useSetState({ searchName: '' });

  const handleDeleteRow = async (id?: string) => {
    if (id) {
      await dispatch(deletePositionAsync(id));
      toast.success('Delete position success!');
      confirm.onFalse();
    } else {
      table.selected.forEach(async (id: string) => {
        await dispatch(deletePositionAsync(id));
      });
      table.onResetPage();
      confirmDeleteRows.onFalse();
    }
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getPositionsAsync({
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
  }, [
    table.page,
    table.rowsPerPage,
    table.order,
    table.orderBy,
    filters.state,
    positionList.length,
  ]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Positions"
          action={
            <ButtonCreate
              permission={UserPermission.POSITION_MANAGEMENT}
              label="New Position"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => create.onTrue(),
              }}
            />
          }
        />

        <PositionCreateEditForm open={create.value} onClose={create.onFalse} />

        <Card>
          <PositionTableToolbar filters={filters} onResetPage={table.onResetPage} />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  positionList.map((row: any) => row.id)
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
                  rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      positionList.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    positionList.map((row: Position) => (
                      <PositionTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}
                  {!isLoading.value && positionList.length === 0 && (
                    <>
                      <TableNoData notFound={!count} />
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
    </>
  );
}
