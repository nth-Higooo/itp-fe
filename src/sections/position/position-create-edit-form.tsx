import { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable';

import { _roles } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import SortableItem from 'src/components/sortable-item';
import { addPositionAsync, updatePositionAsync } from 'src/services/employer/position.service';
import { on } from 'events';
import { useAppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { selectAuth } from 'src/redux/auth/auth.slice';
import { Role, UserPermission } from 'src/data/auth/role.model';
import { getPermissions } from 'src/services/token.service';
import { addComma, removeNonNumeric } from 'src/utils/format-number';

// ----------------------------------------------------------------------
export type TPositionCreateEditFormProps = {
  currentPosition?: any;
  open: boolean;
  onClose?: any;
};

export function PositionCreateEditForm({
  currentPosition,
  open,
  onClose,
}: TPositionCreateEditFormProps) {
  const dispatch = useAppDispatch();

  const defaultValues = useMemo(
    () => ({
      id: currentPosition?.id,
      name: currentPosition?.name || '',
      orderNumber: currentPosition?.orderNumber || 0,
      levels:
        currentPosition?.levels.map((level: any) => {
          return {
            id: level.id || null,
            name: level.level || '',
            salary: addComma(level.salary) || 0,
          };
        }) || [],
      level: currentPosition?.level || '',
      salary: currentPosition?.salary || 0,
    }),
    [currentPosition]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      levels: data.levels.map((level: any) => {
        return {
          ...level,
          salary: removeNonNumeric(level.salary),
        };
      }),
    };

    try {
      if (currentPosition) {
        await dispatch(updatePositionAsync(payload));
        toast.success('Update position success!');
      } else {
        await dispatch(addPositionAsync(payload));
        toast.success('Create position success!');
      }
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'levels',
  });
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const oldIndex = fields.findIndex((l) => l.id === active.id);
    const newIndex = fields.findIndex((l) => l.id === over?.id);

    replace(arrayMove(getValues('levels'), oldIndex, newIndex));
  }

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 520 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentPosition ? 'Update Position' : 'Create Position'}</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1 }}>
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
            >
              <Field.Text
                required
                name="name"
                rules={{ required: 'Position name is required' }}
                label="Position Name"
                sx={{ flexGrow: 1 }}
              />
              <Field.Text
                sx={{ flexShrink: 0, width: { xs: 1, md: 80 } }}
                required
                rules={{ required: 'Order is required' }}
                type="number"
                label="Order"
                name="orderNumber"
              />
            </Stack>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={fields} strategy={rectSwappingStrategy}>
                {fields.map((field: any, index: number) => (
                  <SortableItem key={field.id} id={field.id}>
                    <Controller
                      key={field.id}
                      name={`levels.${index}`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Stack
                          spacing={2}
                          alignItems={{ xs: 'flex-end', md: 'center' }}
                          direction={{ xs: 'column', md: 'row' }}
                        >
                          <Field.Text
                            name={`levels.${index}.name`}
                            InputProps={{
                              endAdornment: (
                                <Button
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  <Iconify icon="solar:trash-bin-trash-bold" />
                                </Button>
                              ),
                            }}
                            key={field.id}
                            rules={{ required: 'Level is required' }}
                            size="medium"
                            placeholder="Level"
                            onChange={(e) => {
                              onChange({ ...value, name: e.target.value });
                            }}
                            value={value.name}
                          />
                          {getPermissions().find(
                            (p) => p.permission === UserPermission.POSITION_MANAGEMENT
                          )?.canViewSalary && (
                            <Field.Text
                              key={field.id}
                              name={`levels.${index}.salary`}
                              type="text"
                              disabled={
                                !getPermissions().find(
                                  (p) => p.permission === UserPermission.POSITION_MANAGEMENT
                                )?.canEditSalary
                              }
                              sx={{ width: '30%' }}
                              size="medium"
                              placeholder="Salary"
                              onChange={(e) => {
                                onChange({
                                  ...value,
                                  salary: addComma(removeNonNumeric(e.target.value)),
                                });
                              }}
                              value={value.salary}
                            />
                          )}
                        </Stack>
                      )}
                    />
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>

            <Stack direction="row" gap={2}>
              <Button
                size="medium"
                onClick={() => {
                  append({ name: '' });
                }}
              >
                New Level
              </Button>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentPosition ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
