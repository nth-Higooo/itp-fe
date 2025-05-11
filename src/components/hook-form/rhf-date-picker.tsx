import dayjs, { Dayjs } from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { formatStr } from 'src/utils/format-time';
import { Badge, Box, TextField, Tooltip, Typography } from '@mui/material';
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { Iconify } from '../iconify';
import { HolidayDays} from 'src/sections/leave-request/leave-request-form';



// ----------------------------------------------------------------------

export function RHFDatePicker({ name, slotProps, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          format={formatStr.split.date}
          slotProps={{
            ...slotProps,
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMobileDateTimePicker({ name, slotProps, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileDateTimePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          format={formatStr.split.dateTime}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------
export function RHFDateRangePicker({ name, slotProps, ...other }: any) {
  const { control } = useFormContext();
  const displayFormat = 'DD/MM/YYYY';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const [startValue, endValue] = field.value || [null, null];

        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DatePicker
              label="Start Date"
              value={dayjs(startValue)}
              onChange={(newValue) => {
                const formattedStart = newValue ? dayjs(newValue).format() : null;
                field.onChange([formattedStart, endValue]);
              }}
              slotProps={{
                ...slotProps,
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message ?? slotProps?.textField?.helperText,
                  ...slotProps?.textField,
                },
              }}
              {...other}
            />
            <DatePicker
              label="End Date"
              value={dayjs(endValue)}
              onChange={(newValue) => {
                const formattedEnd = newValue ? dayjs(newValue).format() : null;
                field.onChange([startValue, formattedEnd]);
              }}
              slotProps={{
                ...slotProps,
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message ?? slotProps?.textField?.helperText,
                  ...slotProps?.textField,
                },
              }}
              {...other}
            />
          </div>
        );
      }}
    />
  );
}
// ----------------------------------------------------------------------


export function RHFDateCalendar({ name, disabledDates = [] ,slotProps, ...other }: any) {
    const { control } = useFormContext();

    const [highlightedDays, setHighlightedDays] = useState<HolidayDays[]>([]);


    const fetchHighlightedDays = async () => {
      const highlightedDaysAsDates: HolidayDays[] = disabledDates.map((date: HolidayDays) => ({
        date: dayjs(date.date).format('YYYY-MM-DD'),
        name: date.name,
      }));
      setHighlightedDays(highlightedDaysAsDates);
    };
  
    useEffect(() => {
      fetchHighlightedDays();
    }, [disabledDates]);

    const shouldDisableHoliday = (date: Dayjs, disabledDates: HolidayDays[]) => {
      const day = date.day();
      if (day === 0 || day === 6) { 
        return true;
      }
      return disabledDates.some((disabledDate: HolidayDays) =>
      dayjs(disabledDate.date).isSame(date, 'date')
    );
  };

    function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: HolidayDays[] }) {
      const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  
      const isSelected = !outsideCurrentMonth && highlightedDays.some((highlightedDay) =>
        dayjs(highlightedDay.date).isSame(day, 'day')
      );
  
      const highlightedDay = highlightedDays.find((highlightedDay) =>
        dayjs(highlightedDay.date).isSame(day, 'day')
      );
  
      return (
        <Badge
          key={props.day.toString()}
          overlap="circular"
          badgeContent={isSelected && highlightedDay ? (
            <Box style={{ width: 10, height: 10, display: 'block' }}>
              <Tooltip
              aria-label={highlightedDay.name}
              title={highlightedDay.name}
              >
                 <Iconify icon="solar:confetti-bold-duotone" style={{ color: 'red', fontSize: 5 }} />
              </Tooltip>
             
            </Box>
          ) : undefined}
        >
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      );
    }
    


    
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            value={dayjs(field.value)}
            shouldDisableDate={(date) => shouldDisableHoliday(date, disabledDates)}
            onChange={(newValue) => field.onChange(dayjs(newValue).format())}
            format={formatStr.split.date}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day:{
                highlightedDays
              } as any,
              ...slotProps,
            }}
            {...other}
          />
        )}
      />
    );
  }