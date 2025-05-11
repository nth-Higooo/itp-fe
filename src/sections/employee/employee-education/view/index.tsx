import { Box, Card, CardHeader, Grid, IconButton, Stack, SvgIcon } from '@mui/material';
import { useEffect, useState } from 'react';
import { EducationsListView } from './educations-list-view';
import { EducationTimeline } from './education-timeline';
import { useTable } from 'src/components/table';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { getEmployeeEducationsAsync } from 'src/services/employee/employee.service';

//------------------------------------------------------------------------------
export function EmployeeEducationsView({ EmployeeID }: { EmployeeID: string }) {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const dispatch = useAppDispatch();
  const isLoading = useBoolean();
  const filters = useSetState({
    employeeId: EmployeeID,
    type: 'ALL',
  });
  const { educationsList } = useAppSelector(selectEmployees);
  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getEmployeeEducationsAsync({
        ...filters.state,
        pageIndex: table.page,
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

  const [isExpanded, setIsExpanded] = useState(false);
  const onToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <>
      <Card>
        <CardHeader
          title="Educations & Certificates"
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
            <Stack sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: '1fr',
                  sm: '40% 60%',
                  md: '40% 60%',
                }}
              >
                <EducationTimeline educationsList={educationsList} isLoading={isLoading.value} />

                <EducationsListView EmployeeID={EmployeeID} />
              </Box>
            </Stack>
          </>
        )}
      </Card>
    </>
  );
}
