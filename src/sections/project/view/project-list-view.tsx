import { useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

import { ProjectTableRow } from '../project-table-row';
import { ProjectTableToolbar } from '../project-table-toolbar';
import { TTheme } from 'src/theme/create-theme';
import { ProjectCreateEditForm } from '../project-create-edit-form';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { PaginationItems } from 'src/components/pagination';
import {
  countProjectSeparatedStatusAsync,
  deleteProjectAsync,
  getProjectsAsync,
  permanentlyDeleteProjectAsync,
  restoreProjectAsync,
} from 'src/services/project.service';
import { ProjectStatus } from 'src/data/project';
import { selectProjects } from 'src/redux/project/project.slice';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'SALES', label: 'Sales' },
  { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ProjectStatus.END, label: 'End' },
  { value: 'TRASH', label: 'Trash' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 200, sortable: true },
  { id: 'department', label: 'Department', width: 200 },
  { id: 'startDate', label: 'Start Date', width: 160 },
  { id: 'endDate', label: 'End Date', width: 160 },
  { id: 'clientName', label: 'Client Name', width: 160 },
  { id: 'type', label: 'Type', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 132 },
];

// ----------------------------------------------------------------------

export function ProjectListView() {
  const isLoading = useBoolean();
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });

  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const confirmRestore = useBoolean();
  const confirmPermanentlyDelete = useBoolean();
  const selectedProject = useSetState(null);

  const filters = useSetState({ name: '', department: '', status: 'ALL' });

  const handleFilterStatus = useCallback(
    (event: any, newValue: any) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const { projects, count, countAllStatus } = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();

  const handleDeleteRow = async () => {
    await dispatch(deleteProjectAsync(selectedProject.state.id));
    await dispatch(countProjectSeparatedStatusAsync());
    await fetchDataList();
    confirmDelete.onFalse();
  };

  const handleRestoreRow = async () => {
    await dispatch(restoreProjectAsync(selectedProject.state.id));
    await dispatch(countProjectSeparatedStatusAsync());
    await fetchDataList();
    confirmRestore.onFalse();
  };

  const handlePermanentlyDeleteRow = async () => {
    await dispatch(permanentlyDeleteProjectAsync(selectedProject.state.id));
    await dispatch(countProjectSeparatedStatusAsync());
    await fetchDataList();
    confirmPermanentlyDelete.onFalse();
  };

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getProjectsAsync({
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
      await dispatch(countProjectSeparatedStatusAsync());
    };
    fetchData();
  }, []);

  const handleOnCloseCreateEdit = async (isSubmit: boolean = false) => {
    if (isSubmit) {
      await dispatch(countProjectSeparatedStatusAsync());
      await fetchDataList();
    }
    createEdit.onFalse();
    selectedProject.onResetState();
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Projects"
          action={
            <Button
              onClick={createEdit.onTrue}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New project
            </Button>
          }
        />

        <ProjectCreateEditForm
          currentProject={selectedProject.state}
          open={createEdit.value}
          onClose={handleOnCloseCreateEdit}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme: TTheme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'ALL' && 'primary') ||
                      (tab.value === 'SALES' && 'success') ||
                      (tab.value === ProjectStatus.IN_PROGRESS && 'warning') ||
                      (tab.value === ProjectStatus.END && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'ALL' && countAllStatus.total}
                    {tab.value === 'SALES' && countAllStatus.totalSales}
                    {tab.value === ProjectStatus.IN_PROGRESS && countAllStatus.totalInProgress}
                    {tab.value === ProjectStatus.END && countAllStatus.totalEnd}
                    {tab.value === 'TRASH' && countAllStatus.totalDeleted}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <ProjectTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ departments: [] }}
          />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  projects.map((row: any) => row.id)
                )
              }
              action={
                <>
                  <Tooltip title="Delete" placement="top" arrow>
                    <IconButton color="primary" onClick={() => {}}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </>
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
                      projects.map((row: any) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!isLoading.value &&
                    projects.map((row: any) => (
                      <ProjectTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => {
                          createEdit.onTrue();
                          selectedProject.setState(row);
                        }}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedProject.setState(row);
                        }}
                        onRestoreRow={() => {
                          confirmRestore.onTrue();
                          selectedProject.setState(row);
                        }}
                        onPermanentlyDeleteRow={() => {
                          confirmPermanentlyDelete.onTrue();
                          selectedProject.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && projects.length === 0 && (
                    <>
                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, projects.length)}
                      />

                      <TableNoData notFound={!projects.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(5)
                      .fill(5)
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
      </DashboardContent>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedProject.onResetState();
        }}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmRestore.value}
        onClose={() => {
          confirmRestore.onFalse();
          selectedProject.onResetState();
        }}
        title="Restore"
        content="Are you sure want to restore?"
        action={
          <Button variant="contained" color="success" onClick={handleRestoreRow}>
            Restore
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmPermanentlyDelete.value}
        onClose={() => {
          confirmPermanentlyDelete.onFalse();
          selectedProject.onResetState();
        }}
        title="Permanently Delete"
        content="Are you sure want to permanently delete?"
        action={
          <Button variant="contained" color="error" onClick={handlePermanentlyDeleteRow}>
            Permanently Delete
          </Button>
        }
      />
    </>
  );
}
