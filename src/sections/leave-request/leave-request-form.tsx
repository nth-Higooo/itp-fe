import { Controller, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectLeave } from 'src/redux/leave/leave.slice';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { Approver } from 'src/data/employee/employee.model';
import { getListApproverAsync } from 'src/services/employee/employee.service';
import { useEffect, useState } from 'react';
import { leaveRequestForm } from 'src/data/leave/leave.model';
import { requestToApproveLeaveAsync } from 'src/services/leave/leave.service';
import { selectHolidays } from 'src/redux/holiday/holiday.slice';
import { getHolidaysAsync } from 'src/services/holiday/holiday.service';
import dayjs, { Dayjs } from 'dayjs';

export type HolidayDays = {
  date: string;
  name: string;
};

export function LeaveTypeCreateEditForm() {
  const dispatch = useAppDispatch();
  const { leaveTypesOfEmployee } = useAppSelector(selectLeave);

  const { holidayList } = useAppSelector(selectHolidays);

  const [showLeavePeriod, setShowLeavePeriod] = useState(false);

  const { approvers } = useAppSelector(selectEmployees);

  const [holidays, setHolidays] = useState<HolidayDays[]>([]);

  const fetchHolidaysDate = async () => {
    const response = await dispatch(getHolidaysAsync());
    if (response.meta.requestStatus === 'fulfilled') {
      const newHolidays: HolidayDays[] = [];
      holidayList.forEach((holiday) => {
        if (holiday.startDate && holiday.endDate) {
          const endDate = dayjs(holiday.endDate).format('YYYY-MM-DD');
          let currentDate = holiday.startDate;
          while (
            dayjs(currentDate).isBefore(endDate) ||
            dayjs(currentDate).isSame(endDate, 'day')
          ) {
            newHolidays.push({ date: dayjs(currentDate).format('YYYY-MM-DD'), name: holiday.name });
            currentDate = dayjs(currentDate).add(1, 'day').toDate();
          }
        }
      });
      setHolidays(newHolidays);
    }
  };
  const fetchApprovers = async () => {
    await dispatch(getListApproverAsync());
  };
  useEffect(() => {
    fetchHolidaysDate();
    fetchApprovers();
  }, [holidayList.length]);

  useEffect(() => {
    setValue('startDate', handleValidDates(dayjs().format('YYYY-MM-DD')));
    setValue('endDate', handleValidDates(dayjs().format('YYYY-MM-DD')));
  }, [holidays]);

  const shouldDisableHoliday = (date: Dayjs, disabledDates: HolidayDays[]) => {
    const day = date.day();
    if (day === 0 || day === 6) {
      return true;
    }
    return disabledDates.some((disabledDate: HolidayDays) =>
      dayjs(disabledDate.date).isSame(date, 'date')
    );
  };

  const handleValidDates = (today: string) => {
    while (shouldDisableHoliday(dayjs(today), holidays) === true) {
      today = dayjs(today).add(1, 'day').format('YYYY-MM-DD');
    }
    return today;
  };

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      Approver: '',
      startDate: handleValidDates(dayjs().format('YYYY-MM-DD')),
      endDate: handleValidDates(dayjs().format('YYYY-MM-DD')),
      reason: '',
      numberOfDays: 0,
      leavePeriodStartDate: 0,
      leavePeriodEndDate: 0,
    },
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const leavePeriodStartDate = watch('leavePeriodStartDate');
  const leavePeriodEndDate = watch('leavePeriodEndDate');

  useEffect(() => {
    const startDate = new Date(watchStartDate).getDate();
    const endDate = new Date(watchEndDate).getDate();
    if (startDate == endDate) {
      if (leavePeriodStartDate === 1) {
        setValue('startDate', dayjs(watchStartDate).set('hour', 9).format('YYYY-MM-DDTHH:mm:ss'));
        setValue('endDate', dayjs(watchEndDate).set('hour', 18).format('YYYY-MM-DDTHH:mm:ss'));
      } else if (leavePeriodStartDate === 0.5) {
        setValue('startDate', dayjs(watchStartDate).set('hour', 9).format('YYYY-MM-DDTHH:mm:ss'));
        setValue('endDate', dayjs(watchEndDate).set('hour', 12).format('YYYY-MM-DDTHH:mm:ss'));
      } else if (leavePeriodStartDate === 0.51) {
        setValue('startDate', dayjs(watchStartDate).set('hour', 13).format('YYYY-MM-DDTHH:mm:ss'));
        setValue('endDate', dayjs(watchEndDate).set('hour', 18).format('YYYY-MM-DDTHH:mm:ss'));
      }
    } else {
      if (leavePeriodStartDate === 1) {
        setValue('startDate', dayjs(watchStartDate).set('hour', 9).format('YYYY-MM-DDTHH:mm:ss'));
      } else if (leavePeriodStartDate === 0.51) {
        setValue('startDate', dayjs(watchStartDate).set('hour', 13).format('YYYY-MM-DDTHH:mm:ss'));
      }
      if (leavePeriodEndDate === 1) {
        setValue('endDate', dayjs(watchEndDate).set('hour', 18).format('YYYY-MM-DDTHH:mm:ss'));
      } else if (leavePeriodEndDate === 0.5) {
        setValue('endDate', dayjs(watchEndDate).set('hour', 12).format('YYYY-MM-DDTHH:mm:ss'));
      }
    }
  }, [leavePeriodStartDate, leavePeriodEndDate]);

  useEffect(() => {
    const startDate = new Date(watchStartDate).getDate();
    const endDate = new Date(watchEndDate).getDate();
    if (startDate == endDate) {
      setShowLeavePeriod(true);
      setValue('numberOfDays', leavePeriodStartDate);
    } else {
      setShowLeavePeriod(false);
    }
  }, [watchStartDate, watchEndDate]);

  useEffect(() => {
    const getWeekdaysBetweenDates = (start: any, end: any) => {
      let totalDays = 0;
      let currentDate = new Date(start);

      while (currentDate < end) {
        const dayOfWeek = currentDate.getDay();
        const day = dayjs(currentDate).format('YYYY-MM-DD');
        if (
          dayOfWeek !== 0 &&
          dayOfWeek !== 6 &&
          !holidays.some((holiday) => holiday.date === day)
        ) {
          totalDays++;
        }
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      totalDays =
        totalDays -
        1 +
        Number(leavePeriodStartDate.toFixed(1)) +
        Number(leavePeriodEndDate.toFixed(1));

      return totalDays;
    };

    if (leavePeriodStartDate && leavePeriodEndDate) {
      const startDate = new Date(watchStartDate);
      const endDate = new Date(watchEndDate);
      if (startDate <= endDate) {
        const numberOfDays = getWeekdaysBetweenDates(startDate, endDate);
        setValue('numberOfDays', numberOfDays);
      }
    } else {
      setValue('numberOfDays', Number(leavePeriodStartDate.toFixed(1)));
    }
  }, [leavePeriodEndDate, leavePeriodStartDate, watchEndDate, watchStartDate, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const Data: leaveRequestForm = {
        leaveTypeId: data.name,
        approverId: data.Approver,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        numberOfDays: data.numberOfDays,
      };
      const response = await dispatch(requestToApproveLeaveAsync(Data));
      if (response.meta.requestStatus === 'fulfilled') {
        reset();
        setValue('startDate', handleValidDates(dayjs().format('YYYY-MM-DD')));
        setValue('endDate', handleValidDates(dayjs().format('YYYY-MM-DD')));
        toast.success('Leave request created successfully');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Box>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Create Leave Request</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="space-between" gap={5}>
              <Field.Select
                required
                name="name"
                label="Leave Type Name"
                rules={{ required: 'Leave Type is required' }}
              >
                {leaveTypesOfEmployee?.results?.map((leaveType: any) => (
                  <MenuItem key={leaveType.id} value={leaveType.id}>
                    {leaveType?.name}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select
                required
                name="Approver"
                label="Assign to"
                rules={{ required: 'Leave Type is required' }}
              >
                {approvers?.map((Approver: Approver) => (
                  <MenuItem key={Approver.id} value={Approver.id}>
                    {Approver.fullName}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Box display="flex" justifyContent="space-between" gap={5}>
              <Field.DateCalendar
                maxDate={dayjs(watchEndDate)}
                sx={{ width: '100%' }}
                rules={{ required: 'Start Date is required' }}
                required
                name="startDate"
                disabledDates={holidays}
                label="Start Date"
              />
              <Field.DateCalendar
                minDate={dayjs(watchStartDate)}
                sx={{ width: '100%' }}
                required
                disabledDates={holidays}
                name="endDate"
                rules={{
                  required: 'End Date is required',
                }}
                label="End Date"
              />
            </Box>
            {showLeavePeriod ? (
              <Box gap={5}>
                <Box maxWidth="47.5%">
                  <Field.Select name="leavePeriodStartDate" label="Leave Period of Start Day">
                    <MenuItem value={1}>All Day</MenuItem>
                    <MenuItem value={0.5}>Morning</MenuItem>
                    <MenuItem value={0.51}>Afternoon</MenuItem>
                  </Field.Select>
                </Box>
              </Box>
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" gap={5}>
                  <Field.Select name="leavePeriodStartDate" label="Leave Period of Start Day">
                    <MenuItem value={1}>All Day</MenuItem>
                    <MenuItem value={0.51}>Afternoon</MenuItem>
                  </Field.Select>
                  <Field.Select
                    name="leavePeriodEndDate"
                    label="Leave Period of End Day"
                    defaultValue={1}
                  >
                    <MenuItem value={1}>All Day</MenuItem>
                    <MenuItem value={0.5}>Morning</MenuItem>
                  </Field.Select>
                </Box>
              </>
            )}
            <Box width="30%">
              <Field.Text
                name="numberOfDays"
                disabled
                label="Number of Days"
                rules={{ required: 'Number of Days is required' }}
              />
            </Box>
            <Field.Text name="reason" label="Reason" multiline minRows="3" sx={{ width: '100%' }} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => reset()}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Create
          </LoadingButton>
        </DialogActions>
      </Form>
    </Box>
  );
}
