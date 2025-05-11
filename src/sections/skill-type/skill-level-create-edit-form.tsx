import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import SortableItem from 'src/components/sortable-item';
import { useAppDispatch } from 'src/redux/store';
import { updateSkillTypeChildAsync } from 'src/services/skill/skill.service';

export type CreateEditFormProps = {
  currentSkillType?: any;
  open: boolean;
  onClose?: any;
};

export function SkillLevelCreateEditFrom({ currentSkillType, open, onClose }: CreateEditFormProps) {
  const dispatch = useAppDispatch();

  const defaultValues = useMemo(() => {
    return {
      id: currentSkillType?.id,
      skillName: currentSkillType?.skillName || '',
      levels: currentSkillType?.levels || [],
    };
  }, [currentSkillType]);

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

  useEffect(() => {
    if (open) {
      if (currentSkillType) {
        reset(defaultValues);
      } else {
        reset({
          id: null,
          skillName: '',
          levels: null,
        });
      }
    }
  }, [currentSkillType, reset, defaultValues, open]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await dispatch(updateSkillTypeChildAsync(data));
      toast.success('Update skill level success!');
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
      onClose={() => {
        reset({ id: null, skillName: '', levels: [] });
        onClose();
      }}
      PaperProps={{ sx: { maxWidth: 520 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{'Update Skill Level'}</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1 }}>
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
            >
              <Field.Text
                rules={{
                  required: 'Skill name is required.',
                }}
                name="skillName"
                label="Skill Type Name"
                sx={{ flexGrow: 1 }}
              />
            </Stack>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={fields} strategy={rectSwappingStrategy}>
                {fields.map((field: any, index: number) => (
                  <SortableItem key={field.id} id={field.id}>
                    <Controller
                      name={`levels.${index}.level`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Field.Text
                          name={`levels.${index}.level`}
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
                          size="medium"
                          placeholder="Skill Level"
                          onChange={onChange}
                          value={value}
                        />
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
              reset({ id: null, skillName: '', levels: [] });
              onClose();
            }}
          >
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentSkillType ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
