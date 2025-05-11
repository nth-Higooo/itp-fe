import { Box, Button, Card, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect } from 'react';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';
import { UserPermission } from 'src/data/auth/role.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { DashboardContent } from 'src/layouts/dashboard';
import { selectDegrees } from 'src/redux/employer/degree.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { deleteDegreeAsync, getDegreesAsync } from 'src/services/Degree/degree.service';
import { DegreeTableRow } from '../degree-table-row';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DegreeCreateEditForm } from '../degree-create-edit-form';
import { toast } from 'sonner';

const TABLE_HEAD = [
  { id: 'name', label: 'Degree', minWidth: 300 },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------
export function DegreeListView() {
  const { degreeList, count } = useAppSelector(selectDegrees);

  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();
  const selectedDegree = useSetState(null);

  const handleDeleteRow = async (id?: string) => {
    if (id) {
      const response = await dispatch(deleteDegreeAsync(id));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Add degree successfully!');
        selectedDegree.onResetState();
        fetchDataList();
      }
      confirmDelete.onFalse();
    }
  };
  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getDegreesAsync({
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
  }, [table.page, table.rowsPerPage, table.orderBy, table.order]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Degrees"
          action={
            <ButtonCreate
              permission={UserPermission.DEGREE_MANAGEMENT}
              label="New Degree"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => {
                  if (selectedDegree) {
                    selectedDegree.onResetState();
                  }

                  createEdit.onTrue();
                },
              }}
            />
          }
        />
        <DegreeCreateEditForm
          currentDegree={selectedDegree.state}
          open={createEdit.value}
          onClose={() => {
            createEdit.onFalse();
            selectedDegree.onResetState();
          }}
          fetchDataList={fetchDataList}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction dense={table.dense} numSelected={table.selected.length} />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 720, alignItems: 'center' }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {!isLoading.value &&
                    degreeList.map((row: any, index: number) => (
                      <DegreeTableRow
                        key={index}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onEditRow={() => {
                          createEdit.onTrue();
                          selectedDegree.setState(row);
                        }}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedDegree.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && degreeList.length === 0 && (
                    <>
                      <TableNoData notFound={!degreeList.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(7)
                      .fill(7)
                      .map((_, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell colSpan={3} align="center">
                              <Skeleton variant="rounded" width={'100%'} height={60} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
        </Card>
      </DashboardContent>
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedDegree.onResetState();
        }}
        title="Delete"
        content={<>Are you sure want to delete this Degree?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRow(selectedDegree.state.id)}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
