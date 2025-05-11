import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList } from 'src/_mock';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTable, TableHeadCustom, TableSelectedAction, TableNoData } from 'src/components/table';

import { EmployeeTableRow } from '../employee-table-row';
import { EmployeeTableToolbar } from '../employee-table-toolbar';
import { TTheme } from 'src/theme/create-theme';
import { resetEmployeesState, selectEmployees } from 'src/redux/employee/employees.slice';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  countEmployeesAllStatusAsync,
  deleteEmployeesAsync,
  exportEmployeesAsync,
  getEmployeesWithDepartmentsAsync,
  permanentlyDeleteEmployeesAsync,
  resendEmailSetPasswordOfEmployeeAsync,
  restoreEmployeesAsync,
} from 'src/services/employee/employee.service';
import { getAllDepartmentsAsync, getAllPositionsWithLevels } from 'src/services/selection.service';
import { Employee, EmployeeStatus } from 'src/data/employee/employee.model';
import { useNavigate } from 'react-router';
import FilesImport from '../employee-modal-import-file';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { UserPermission } from 'src/data/auth/role.model';
import { PaginationItems } from 'src/components/pagination';
import {
  ButtonCreate,
  ButtonExport,
  ButtonImport,
} from 'src/components/button-permission/button-permission';
import { UserStatus } from 'src/data/auth/user.model';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: EmployeeStatus.ACTIVE, label: 'Active' },
  { value: EmployeeStatus.RESIGN, label: 'Resign' },
  { value: EmployeeStatus.NO_CONTRACT, label: 'No Contract' },
  { value: EmployeeStatus.TRASH, label: 'Trash' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'departments', label: 'Department', width: 180 },
  { id: 'positions', label: 'Position', width: 180 },
  { id: 'working_type', label: 'Working Type', width: 180, sortable: true },
  { id: 'contract_type', label: 'Contract Type', width: 180, sortable: true },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function EmployeeListView() {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const { employeeList, total, countAllStatus } = useAppSelector(selectEmployees);
  const { departments, positionWithLevels, getPositionsStatus, getDepartmentStatus } =
    useAppSelector(selectSelections);
  const dispatch = useAppDispatch();
  const [fileType, setFileType] = useState<string>('');
  const confirmDeleteRows = useBoolean();
  const resendEmail = useBoolean();
  const resendEmailRows = useBoolean();
  const confirmDeleteRow = useBoolean();
  const confirmRestore = useBoolean();
  const confirmImport = useBoolean();
  const [canSendEmail, setCanEmail] = useState<boolean>(false);
  const isLoading = useBoolean();
  const confirmPermanentlyDelete = useBoolean();
  const confirmPermanentlyDeleteRows = useBoolean();
  const confirmRestoreRows = useBoolean();
  const selectedEmployee = useSetState(null);
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
  const navigate = useNavigate();

  const onSelectSingleRow = useCallback(
    (inputValue: any) => {
      const newSelected = selectedEmployees.includes(inputValue)
        ? selectedEmployees.filter((value: any) => value !== inputValue)
        : [...selectedEmployees, inputValue];
      setSelectedEmployees(newSelected);
      if (newSelected.some((row: any) => row.status !== UserStatus.PENDING)) {
        setCanEmail(false);
      } else {
        setCanEmail(true);
      }
    },
    [selectedEmployees]
  );

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
    status: '',
    employeeStatus: 'ALL',
  });
  const handleExportFile = async () => {
    try {
      dispatch(
        exportEmployeesAsync({
          ...filters.state,
          pageIndex: table.page + 1,
          pageSize: table.rowsPerPage,
          orderBy: table.order,
          sortBy: table.orderBy,
        })
      );
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };
  const handleDeleteRow = async (checked?: boolean) => {
    if (checked) {
      table.selected.map(async (id: any) => {
        await dispatch(deleteEmployeesAsync(id));
        dispatch(
          countEmployeesAllStatusAsync({
            departmentId: filters.state.departmentId,
            positionId: filters.state.positionId,
            status: filters.state.status,
          })
        );
      });
      await fetchDataList();
      setSelectedEmployees([]);
      table.onResetPage();
      confirmDeleteRows.onFalse();
    } else {
      await dispatch(deleteEmployeesAsync(selectedEmployee.state.id));
      await fetchDataList();
      await dispatch(
        countEmployeesAllStatusAsync({
          departmentId: filters.state.departmentId,
          positionId: filters.state.positionId,
          status: filters.state.status,
        })
      );
      confirmDeleteRow.onFalse();
    }
  };

  const handleResendRow = async (checked?: boolean) => {
    if (checked) {
      const EmployeesIds = selectedEmployees.map((row: Employee) => row.userId);
      console.log(EmployeesIds);
      const response = await dispatch(resendEmailSetPasswordOfEmployeeAsync(EmployeesIds));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Resend email success!');
        resendEmailRows.onFalse();
      }
    } else {
      const response = await dispatch(
        resendEmailSetPasswordOfEmployeeAsync([selectedEmployee.state.userId])
      );
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Resend email success!');
        selectedEmployee.onResetState();
        table.onResetPage();
        resendEmail.onFalse();
      }
    }
  };

  const handlePermanentlyDeleteRow = async (checked?: boolean) => {
    if (checked) {
      table.selected.map(async (id: any) => {
        await dispatch(permanentlyDeleteEmployeesAsync(id));
        await fetchDataList();
        dispatch(
          countEmployeesAllStatusAsync({
            departmentId: filters.state.departmentId,
            positionId: filters.state.positionId,
            status: filters.state.status,
          })
        );
        setSelectedEmployees([]);
        table.onResetPage();
      });

      confirmPermanentlyDeleteRows.onFalse();
    } else {
      await dispatch(permanentlyDeleteEmployeesAsync(selectedEmployee.state.id));
      await fetchDataList();
      await dispatch(
        countEmployeesAllStatusAsync({
          departmentId: filters.state.departmentId,
          positionId: filters.state.positionId,
          status: filters.state.status,
        })
      );
      confirmPermanentlyDelete.onFalse();
    }
  };

  const handleRestoreRow = async (checked?: boolean) => {
    if (checked) {
      table.selected.map((id: any) => {
        dispatch(restoreEmployeesAsync(id));
        dispatch(
          countEmployeesAllStatusAsync({
            departmentId: filters.state.departmentId,
            positionId: filters.state.positionId,
            status: filters.state.status,
          })
        );
      });
      await fetchDataList();
      setSelectedEmployees([]);
      table.onResetPage();
      confirmRestoreRows.onFalse();
    } else {
      await dispatch(restoreEmployeesAsync(selectedEmployee.state.id));
      await fetchDataList();
      await dispatch(
        countEmployeesAllStatusAsync({
          departmentId: filters.state.departmentId,
          positionId: filters.state.positionId,
          status: filters.state.status,
        })
      );
      selectedEmployee.onResetState();
      confirmRestore.onFalse();
    }
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      const allSelectedEmployees = employeeList.map((row: any) => row);
      setSelectedEmployees(allSelectedEmployees);
      if (allSelectedEmployees.some((row: any) => row.status !== UserStatus.PENDING)) {
        setCanEmail(false);
      } else {
        setCanEmail(true);
      }
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleFilterStatus = useCallback(
    (event: any, newValue: any) => {
      table.onResetPage();
      filters.setState({ ...filters.state, employeeStatus: newValue });
    },
    [filters, table]
  );

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getEmployeesWithDepartmentsAsync({
        ...filters.state,
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
        sortBy: table.orderBy,
        orderBy: table.order,
      })
    );
    isLoading.onFalse();
  };
  useEffect(() => {
    fetchDataList();
    dispatch(
      countEmployeesAllStatusAsync({
        departmentId: filters.state.departmentId,
        positionId: filters.state.positionId,
        status: filters.state.status,
      })
    );
  }, [
    filters.state,
    table.page,
    table.rowsPerPage,
    table.orderBy,
    table.order,
    employeeList.length,
  ]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Employees"
          action={
            <Box gap={2} display="flex">
              <ButtonCreate
                permission={UserPermission.EMPLOYEE_MANAGEMENT}
                label="New Employee"
                props={{
                  variant: 'contained',
                  color: 'primary',
                  component: RouterLink,
                  href: paths.employee.new,
                  to: paths.employee.new,
                  onClick: () => dispatch(resetEmployeesState()),
                  startIcon: <Iconify icon="mingcute:add-line" />,
                }}
              />
              <ButtonImport
                permission={UserPermission.EMPLOYEE_MANAGEMENT}
                label="Import CSV"
                props={{
                  variant: 'contained',
                  color: 'primary',
                  onClick: () => {
                    setFileType('text/csv');
                    confirmImport.onTrue();
                  },
                  startIcon: <Iconify icon="solar:import-bold" />,
                }}
              />
              <ButtonImport
                permission={UserPermission.EMPLOYEE_MANAGEMENT}
                label="Import Excel"
                props={{
                  variant: 'contained',
                  color: 'primary',
                  onClick: () => {
                    setFileType(
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    );
                    confirmImport.onTrue();
                  },
                  startIcon: <Iconify icon="solar:import-bold" />,
                }}
              />
              <ButtonExport
                permission={UserPermission.EMPLOYEE_MANAGEMENT}
                label="Export"
                props={{
                  variant: 'contained',
                  color: 'primary',
                  onClick: () => handleExportFile(),
                  startIcon: <Iconify icon="solar:export-bold" />,
                }}
              />
            </Box>
          }
        />
        <Card>
          <Tabs
            value={filters.state.employeeStatus}
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
                      ((tab.value === 'ALL' || tab.value === filters.state.employeeStatus) &&
                        'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'ALL' && 'primary') ||
                      (tab.value === EmployeeStatus.ACTIVE && 'success') ||
                      (tab.value === EmployeeStatus.RESIGN && 'warning') ||
                      (tab.value === EmployeeStatus.NO_CONTRACT && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'ALL' && countAllStatus.total}
                    {tab.value === EmployeeStatus.ACTIVE && countAllStatus.totalActive}
                    {tab.value === EmployeeStatus.RESIGN && countAllStatus.totalResign}
                    {tab.value === EmployeeStatus.NO_CONTRACT && countAllStatus.totalNoContract}
                    {tab.value === EmployeeStatus.TRASH && countAllStatus.totalDeleted}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <EmployeeTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            optionsDepartments={departments}
            optionsPositions={positionWithLevels}
          />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={Math.min(total - table.rowsPerPage * table.page, table.rowsPerPage)}
              onSelectAllRows={(checked: boolean) => {
                table.onSelectAllRows(
                  checked,
                  employeeList.map((row: any) => row.id)
                );
                handleSelectAllRows(checked);
              }}
              action={
                <>
                  {filters.state.employeeStatus === EmployeeStatus.TRASH ? (
                    <>
                      <Tooltip title="Restore" placement="top" arrow>
                        <IconButton color="default" onClick={confirmRestoreRows.onTrue}>
                          <Iconify icon="solar:multiple-forward-left-bold" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permanently Delete" placement="top" arrow>
                        <IconButton color="error" onClick={confirmPermanentlyDeleteRows.onTrue}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {canSendEmail && (
                        <Tooltip title="Resend" placement="top" arrow>
                          <IconButton color="default" onClick={resendEmailRows.onTrue}>
                            <Iconify icon="solar:plain-bold" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={confirmDeleteRows.onTrue}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </>
              }
            />
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Math.min(total - table.rowsPerPage * table.page, table.rowsPerPage)}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked: any) => {
                    table.onSelectAllRows(
                      checked,
                      employeeList.map((row: any) => row.id)
                    );
                    handleSelectAllRows(checked);
                  }}
                />
                <FilesImport
                  open={confirmImport.value}
                  filetype={fileType}
                  cancel={confirmImport.onFalse}
                />
                <TableBody>
                  {!isLoading.value &&
                    employeeList.map((row: any) => (
                      <EmployeeTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => {
                          table.onSelectRow(row.id);
                          onSelectSingleRow(row);
                        }}
                        onEditRow={() => {
                          selectedEmployee.setState(row);
                          navigate(`/employees/${row.id}`);
                        }}
                        onDeleteRow={() => {
                          confirmDeleteRow.onTrue();
                          selectedEmployee.setState(row);
                        }}
                        onRestoreRow={() => {
                          confirmRestore.onTrue();
                          selectedEmployee.setState(row);
                        }}
                        onPermanentlyDeleteRow={() => {
                          confirmPermanentlyDelete.onTrue();
                          selectedEmployee.setState(row);
                        }}
                        onResendRow={() => {
                          resendEmail.onTrue();
                          selectedEmployee.setState(row);
                        }}
                      />
                    ))}
                  {!isLoading.value && employeeList.length === 0 && (
                    <>
                      <TableNoData notFound={!employeeList.length} />
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
            count={total}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={resendEmail.value}
        onClose={() => {
          resendEmail.onFalse();
          selectedEmployee.onResetState();
        }}
        title="Resend"
        content="Are you sure want to resend email to this employee ?"
        action={
          <Button variant="contained" color="info" onClick={() => handleResendRow(false)}>
            Resend
          </Button>
        }
      />
      <ConfirmDialog
        open={resendEmailRows.value}
        onClose={() => {
          resendEmailRows.onFalse();
        }}
        title="Resend"
        content="Are you sure want to resend email to these employees ?"
        action={
          <Button variant="contained" color="info" onClick={() => handleResendRow(true)}>
            Resend
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDeleteRow.value}
        onClose={() => {
          confirmDeleteRow.onFalse();
          selectedEmployee.onResetState();
        }}
        title="Delete"
        content="Are you sure want to delete this employee?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteRow(false)}>
            Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmDeleteRows.value}
        onClose={() => {
          confirmDeleteRows.onFalse();
        }}
        title="Delete"
        content="Are you sure want to delete these employees?"
        action={
          <Button variant="contained" color="error" onClick={() => handleDeleteRow(true)}>
            Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmPermanentlyDelete.value}
        onClose={() => {
          confirmPermanentlyDelete.onFalse();
          selectedEmployee.onResetState();
        }}
        title="Permanently Delete"
        content="Are you sure want to permanently delete this employee?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handlePermanentlyDeleteRow(false)}
          >
            Permanently Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmPermanentlyDeleteRows.value}
        onClose={() => {
          confirmPermanentlyDeleteRows.onFalse();
        }}
        title="Permanently Delete"
        content="Are you sure want to permanently delete these employees?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handlePermanentlyDeleteRow(true)}
          >
            Permanently Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmRestoreRows.value}
        onClose={() => {
          confirmRestoreRows.onFalse();
        }}
        title="Restore"
        content="Are you sure want to restore these employees?"
        action={
          <Button variant="contained" color="error" onClick={() => handleRestoreRow(true)}>
            Restore
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmRestore.value}
        onClose={() => {
          confirmRestore.onFalse();
          selectedEmployee.onResetState();
        }}
        title="Restore"
        content="Are you sure want to restore this employee ?"
        action={
          <Button variant="contained" color="error" onClick={() => handleRestoreRow(false)}>
            Restore
          </Button>
        }
      />
    </>
  );
}
