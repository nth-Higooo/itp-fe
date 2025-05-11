import { useMemo, useState, useCallback } from 'react';

import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

import { uuidv4 } from 'src/utils/uuidv4';
import { fAdd, formatStr, today } from 'src/utils/format-time';

import { _mock } from 'src/_mock';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------
type TKanbanTaskAddProps = any;

export function KanbanTaskAdd({
  status,
  openAddTask,
  onAddTask,
  onCloseAddTask,
}: TKanbanTaskAddProps) {
  const [taskName, setTaskName] = useState('');

  const defaultTask = useMemo(
    () => ({
      id: uuidv4(),
      status,
      name: taskName.trim() ? taskName : 'Untitled',
      priority: 'medium',
      attachments: [],
      labels: [],
      comments: [],
      assignee: [],
      due: [today(formatStr.date), fAdd({ days: 1 })],
      reporter: { id: _mock.id(16), name: _mock.fullName(16), avatarUrl: _mock.image.avatar(16) },
    }),
    [status, taskName]
  );

  const handleChangeName = useCallback((event: any) => {
    setTaskName(event.target.value);
  }, []);

  const handleKeyUpAddTask = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        onAddTask(defaultTask);
        setTaskName('');
      }
    },
    [defaultTask, onAddTask]
  );

  const handleCancel = useCallback(() => {
    setTaskName('');
    onCloseAddTask();
  }, [onCloseAddTask]);

  if (!openAddTask) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleCancel}>
      <div>
        <Paper
          sx={{
            borderRadius: 1.5,
            bgcolor: 'background.default',
            boxShadow: (theme: TTheme) => theme.customShadows.z1,
          }}
        >
          <InputBase
            autoFocus
            fullWidth
            placeholder="Untitled"
            value={taskName}
            onChange={handleChangeName}
            onKeyUp={handleKeyUpAddTask}
            sx={{
              px: 2,
              height: 56,
              [`& .${inputBaseClasses.input}`]: { p: 0, typography: 'subtitle2' },
            }}
          />
        </Paper>

        <FormHelperText sx={{ mx: 1 }}>Press Enter to create the task.</FormHelperText>
      </div>
    </ClickAwayListener>
  );
}
