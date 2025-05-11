import { useState, useEffect } from 'react';

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
import { useTable, TableNoData, TableHeadCustom, TableSelectedAction } from 'src/components/table';

import { DepartmentTableRow } from '../department-table-row';
import { DepartmentTableToolbar } from '../department-table-toolbar';
import { DepartmentCreateEditForm } from '../department-create-edit-form';
import { useSelector } from 'react-redux';
import { selectDepartments } from 'src/redux/employer/departments.slice';
import { useAppDispatch } from 'src/redux/store';
import {
  deleteDepartmentAsync,
  getDepartmentsAsync,
} from 'src/services/employer/department.service';
import { getAllDepartmentsAsync } from 'src/services/selection.service';
import { IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';

import { UserPermission } from 'src/data/auth/role.model';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Department', minWidth: 250 },
  { id: 'type', label: 'Type', width: 200 },
  { id: 'manager.name', label: 'Manager' },
  { id: 'employeeQuantity', label: 'Quantity', width: 200 },
  { id: '', width: 80 },
];

// ----------------------------------------------------------------------

export function DepartmentListView() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const confirmDeleteRows = useBoolean();
  const isLoading = useBoolean();
  const selectedDepartment = useSetState(null);
  const dispatch = useAppDispatch();

  const filters = useSetState({ search: '' });

  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);

  const { count, departmentList, employeeQuantity } = useSelector(selectDepartments);

  const handleDeleteRow = async (id?: string) => {
    if (id) {
      await dispatch(deleteDepartmentAsync(id));
      confirmDelete.onFalse();
    } else {
      table.selected.map(async (id: string) => {
        await dispatch(deleteDepartmentAsync(id));
        fetchDataList();
      });
      table.onResetPage();
      confirmDeleteRows.onFalse();
    }
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getDepartmentsAsync({
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

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllDepartmentsAsync());
    };
    fetchData();
  }, []);

  const toggleExpandRow = (id: number) => {
    setExpandedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Departments"
          action={
            <ButtonCreate
              permission={UserPermission.DEPARTMENT_MANAGEMENT}
              label="New Department"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => createEdit.onTrue(),
              }}
            />
          }
        />
        <DepartmentCreateEditForm
          currentDepartment={selectedDepartment.state}
          open={createEdit.value}
          onClose={() => {
            createEdit.onFalse();
            selectedDepartment.onResetState();
          }}
          fetchDataList={fetchDataList}
        />

        <Card>
          <DepartmentTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            employeeQuantity={employeeQuantity}
          />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  departmentList.map((row: any) => row.id)
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
                      departmentList.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    departmentList.map((row: any) => (
                      <>
                        <DepartmentTableRow
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEditRow={() => {
                            createEdit.onTrue();
                            selectedDepartment.setState(row);
                          }}
                          onDeleteRow={() => {
                            confirmDelete.onTrue();
                            selectedDepartment.setState(row);
                          }}
                          onToggleExpand={() => toggleExpandRow(row.id)}
                          isExpanded={expandedRowIds.includes(row.id)}
                        />

                        {expandedRowIds.includes(row.id) &&
                          row.childrenDepartment &&
                          row.childrenDepartment.map((child: any, index: number) => (
                            <DepartmentTableRow
                              key={`${child.id}-${index}`}
                              row={child}
                              selected={table.selected.includes(child.id)}
                              onSelectRow={() => table.onSelectRow(child.id)}
                              onEditRow={() => {
                                createEdit.onTrue();
                                selectedDepartment.setState(child);
                              }}
                              onDeleteRow={() => {
                                confirmDelete.onTrue();
                                selectedDepartment.setState(child);
                              }}
                              isChild // Mark as child row
                            />
                          ))}
                      </>
                    ))}

                  {!isLoading.value && departmentList.length === 0 && (
                    <>
                      <TableNoData notFound={!departmentList.length} />
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
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedDepartment.onResetState();
        }}
        title="Delete"
        content={<>Are you sure want to delete this Department?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRow(selectedDepartment.state.id)}
          >
            Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmDeleteRows.value}
        onClose={confirmDeleteRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> Departments?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteRow()}>
            Delete
          </Button>
        }
      />
    </>
  );
}
