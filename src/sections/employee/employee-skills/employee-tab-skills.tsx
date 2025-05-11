import { useCallback, useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';

import {
  Box,
  Button,
  CardHeader,
  IconButton,
  Skeleton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { PaginationItems } from 'src/components/pagination';
import { EmployeeSkillTableRow } from './employee-skill-table-row';
import { SkillCreateEditForm } from './employee-skill-create-edit-form';
import { deleteEmployeeSkillAsync, getEmployeeSkillsAsync } from 'src/services/skill/skill.service';
import { useSetState } from 'src/hooks/use-set-state';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'sonner';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';

const TABLE_HEAD = [
  { id: 'name', label: 'Skill Name' },
  { id: 'skillType', label: 'Skill Type' },
  { id: 'level', label: 'Level' },
  { id: '', label: '', width: 150 },
];

// ----------------------------------------------------------------------

export function EmployeeTabSkills({ currentEmployee }: any) {
  const { skillList, count } = useAppSelector(selectEmployees);
  const [isExpanded, setIsExpanded] = useState(false);
  const confirmDelete = useBoolean();
  const selectedSkill = useSetState(null);
  const createEdit = useBoolean();

  const onToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();

  const table = useTable({
    defaultOrderBy: 'status',
    defaultRowsPerPage: 10,
  });

  const handleDeleteRow = async (id?: string) => {
    if (id) {
      const response = await dispatch(deleteEmployeeSkillAsync(id));
      if (response.meta.requestStatus === 'fulfilled') {
        confirmDelete.onFalse();

        toast.success('Delete skill successfully!');
      }

      fetchDataList();
    } else {
      table.selected.map(async (id: string) => {
        const response = await dispatch(deleteEmployeeSkillAsync(id));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Delete skill successfully!');
        }
        fetchDataList();
      });
      table.onResetPage();
      confirmDelete.onFalse();
    }
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getEmployeeSkillsAsync({
        id: currentEmployee.id,
        params: {
          pageSize: table.rowsPerPage,
          pageIndex: table.page,
          orderBy: table.order,
          sortBy: table.orderBy,
        },
      })
    );
    isLoading.onFalse();
  };

  useEffect(() => {
    fetchDataList();
  }, [table.page, table.rowsPerPage, table.order, table.orderBy, skillList.length]);
  return (
    <Grid xs={12}>
      <Card>
        <CardHeader
          title="Skills"
          sx={{ mb: 3 }}
          action={
            <IconButton size="small" onClick={onToggleExpand} sx={{ marginLeft: 2 }}>
              <SvgIcon
                sx={{
                  width: 16,
                  height: 16,
                  transform: isExpanded ? 'rotate(270deg)' : 'rotate(90deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <path
                  fill="currentColor"
                  d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"
                />
              </SvgIcon>
            </IconButton>
          }
        />
        {isExpanded && (
          <>
            <Box sx={{ p: 3, pt: 0, textAlign: 'right' }}>
              <ButtonCreate
                permission={UserPermission.EMPLOYEE_MANAGEMENT}
                label="New Skill"
                props={{
                  variant: 'contained',
                  color: 'primary',
                  startIcon: <Iconify icon="mdi:plus" />,
                  onClick: () => {
                    if (selectedSkill) {
                      selectedSkill.onResetState();
                    }

                    createEdit.onTrue();
                  },
                }}
              />

              <SkillCreateEditForm
                open={createEdit.value}
                onClose={createEdit.onFalse}
                currentSkill={selectedSkill.state}
                employeeId={currentEmployee.id}
                onSubmitSuccess={fetchDataList}
              />
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {!isLoading.value &&
                      skillList.map((row: any) => (
                        <EmployeeSkillTableRow
                          key={row.id}
                          row={row}
                          onDeleteRow={() => {
                            confirmDelete.onTrue();
                            selectedSkill.setState(row);
                          }}
                          onEditRow={() => {
                            createEdit.onTrue();
                            selectedSkill.setState(row);
                          }}
                        />
                      ))}

                    {!isLoading.value && skillList.length === 0 && (
                      <>
                        <TableNoData notFound={!skillList.length} />
                      </>
                    )}
                    {isLoading.value &&
                      Array(5)
                        .fill(5)
                        .map(() => {
                          return (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
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
            <ConfirmDialog
              open={confirmDelete.value}
              onClose={() => {
                confirmDelete.onFalse();
                selectedSkill.onResetState();
              }}
              title="Delete"
              content={<>Are you sure want to delete this Skill</>}
              action={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteRow(selectedSkill.state.id)}
                >
                  Delete
                </Button>
              }
            />
          </>
        )}
      </Card>
    </Grid>
  );
}
