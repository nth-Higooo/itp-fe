import { Typography, Paper, Stack } from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { Iconify } from 'src/components/iconify';
import { EmployeeEducations } from 'src/data/employee/employee.model';
import { useTheme } from '@emotion/react';

interface EducationTimelineProps {
  educationsList: EmployeeEducations[];
  isLoading: boolean;
}

export function EducationTimeline({ educationsList }: EducationTimelineProps) {
  const theme = useTheme();
  return (
    <>
      <Timeline sx={{ minWidth: 450 }} position="alternate">
        {educationsList.map((education) => (
          <TimelineItem key={education.id} position={education.certificateName ? 'left' : 'right'}>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: education.certificateName ? '#ef5350' : '#5c6bc0',
                }}
              >
                {education.certificateName ? (
                  <Iconify icon="solar:book-2-bold-duotone" />
                ) : (
                  <Iconify icon="solar:medal-ribbons-star-bold-duotone" />
                )}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Stack spacing={1}>
                  {education.degree ? (
                    <>
                      <Typography variant="subtitle2">
                        {education.degree?.name} of {education.major}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {education.school}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {education.fromYear} - {education.toYear}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2">{education.certificateName}</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {education.certificateWebsite}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {education.toYear}
                      </Typography>
                    </>
                  )}
                </Stack>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
