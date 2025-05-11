import {
  Box,
  Button,
  Card,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { PaginationItems } from 'src/components/pagination';
import { Scrollbar } from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { UserPermission } from 'src/data/auth/role.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { DashboardContent } from 'src/layouts/dashboard';
import { selectSkill } from 'src/redux/skill/skill.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { deleteSkillTypeAsync, getSkillTypeAsync } from 'src/services/skill/skill.service';
import { SkillTypeTableRow } from '../skill-type-table-row';
import { useSetState } from 'src/hooks/use-set-state';
import { SkillTypeCreateEditForm } from '../skill-type-create-edit-form';
import { SkillLevelCreateEditFrom } from '../skill-level-create-edit-form';
import { toast } from 'src/components/snackbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Skill Type', width: 260, sortable: true },
  { id: 'level', label: 'Levels', sortable: true },
  { id: '', width: 88 },
];

//-----------------------------------------------

export function SkillTypeListView() {
  const confirm = useBoolean();
  const { skillTypeList, count } = useAppSelector(selectSkill);
  const table = useTable();
  const confirmDelete = useBoolean();
  const selectedSkill = useSetState(null);
  const createEditParent = useBoolean();
  const editChild = useBoolean();
  const confirmDeleteRows = useBoolean();
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);

  const toggleExpandRow = (id: number) => {
    setExpandedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getSkillTypeAsync({
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
        orderBy: table.order,
      })
    );
    isLoading.onFalse();
  };

  useEffect(() => {
    fetchDataList();
  }, [table.page, table.rowsPerPage, table.order, table.orderBy]);

  const handleDeleteRow = async (id?: string) => {
    try {
      isLoading.onTrue();

      if (id) {
        await dispatch(deleteSkillTypeAsync(id));

        confirm.onFalse();
        toast.success('Skill Type deleted successfully!');
      } else {
        await Promise.all(
          table.selected.map((selectedId: any) => dispatch(deleteSkillTypeAsync(selectedId)))
        );
        toast.success('Skill Types deleted successfully!');

        table.onResetPage();
        confirmDeleteRows.onFalse();
      }

      await fetchDataList();
    } catch (error) {
      console.error('Error deleting skill type:', error);
    } finally {
      isLoading.onFalse();
    }
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Skill Types"
          action={
            <ButtonCreate
              permission={UserPermission.SKILL_TYPE_MANAGEMENT}
              label="New Skill Type"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => createEditParent.onTrue(),
              }}
            />
          }
        />

        <SkillTypeCreateEditForm
          currentSkill={selectedSkill.state}
          open={createEditParent.value}
          onClose={() => {
            createEditParent.onFalse();
            selectedSkill.onResetState();
          }}
          fetchDataList={fetchDataList}
        />

        <SkillLevelCreateEditFrom
          currentSkillType={selectedSkill.state}
          open={editChild.value}
          onClose={() => {
            editChild.onFalse();
            selectedSkill.onResetState();
            fetchDataList();
          }}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  skillTypeList.map((row: any) => row.id)
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
                      skillTypeList.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    skillTypeList.map((row: any) => (
                      <>
                        <SkillTypeTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onEditRow={() => {
                            createEditParent.onTrue();
                            selectedSkill.setState(row);
                          }}
                          onDeleteRow={() => {
                            confirmDelete.onTrue();
                            selectedSkill.setState(row);
                          }}
                          onToggleExpand={() => toggleExpandRow(row.id)}
                          isExpanded={expandedRowIds.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                        />
                        {expandedRowIds.includes(row.id) &&
                          row.skillNames &&
                          row.skillNames.map((child: any, index: number) => (
                            <SkillTypeTableRow
                              key={`${child.id}-${index}`}
                              row={child}
                              selected={table.selected.includes(child.id)}
                              onSelectRow={() => table.onSelectRow(child.id)}
                              onEditRow={() => {
                                editChild.onTrue();
                                selectedSkill.setState(child);
                              }}
                              onDeleteRow={() => {
                                confirmDelete.onTrue();
                                selectedSkill.setState(child);
                              }}
                              isChild
                            />
                          ))}
                      </>
                    ))}

                  {!isLoading.value && skillTypeList.length === 0 && (
                    <>
                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, count)}
                      />
                      <TableNoData notFound={!skillTypeList.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(8)
                      .fill(9)
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
      </DashboardContent>
    </>
  );
}
