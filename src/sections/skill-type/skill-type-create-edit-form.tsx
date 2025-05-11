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
import { addSkillTypeAsync, updateSkillTypeParentAsync } from 'src/services/skill/skill.service';

export type CreateEditFormProps = {
  currentSkill?: any;
  open: boolean;
  onClose?: any;
  fetchDataList: () => void;
};

export function SkillTypeCreateEditForm({
  currentSkill,
  open,
  onClose,
  fetchDataList,
}: CreateEditFormProps) {
  const dispatch = useAppDispatch();

  const defaultValues = useMemo(() => {
    return {
      id: currentSkill?.id,
      name: currentSkill?.name,
      orderNumber: currentSkill?.orderNumber,
      skillNames: currentSkill?.skillNames,
    };
  }, [currentSkill]);

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
      if (currentSkill) {
        reset(defaultValues);
      } else {
        reset({
          id: null,
          name: '',
          orderNumber: '',
          skillNames: null,
        });
      }
    }
  }, [currentSkill, reset, defaultValues, open]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onSubmit = handleSubmit(async (data: any) => {
    console.log('dataUpdate', data);
    try {
      if (currentSkill) {
        await dispatch(updateSkillTypeParentAsync(data));
        console.log('dataUpdate: ', data);
        toast.success('Update skill type success!');
        fetchDataList();
      } else {
        await dispatch(addSkillTypeAsync(data));
        toast.success('Create skill type success!');
        fetchDataList();
      }
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'skillNames',
  });
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const oldIndex = fields.findIndex((l) => l.id === active.id);
    const newIndex = fields.findIndex((l) => l.id === over?.id);

    replace(arrayMove(getValues('skillNames'), oldIndex, newIndex));
  }
  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={() => {
        reset({ id: null, name: '', orderNumber: '', skillNames: [] });
        onClose();
      }}
      PaperProps={{ sx: { maxWidth: 520 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentSkill ? 'Update Skill Type' : 'Create  Skill Type'}</DialogTitle>

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
                name="name"
                label="Skill Type Name"
                sx={{ flexGrow: 1 }}
              />
              <Field.Text
                rules={{
                  required: 'Required',
                }}
                sx={{ flexShrink: 0, width: { xs: 1, md: 80 } }}
                type="number"
                label="Order"
                name="orderNumber"
              />
            </Stack>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={fields} strategy={rectSwappingStrategy}>
                {fields.map((field, index: number) => (
                  <SortableItem key={field.id} id={field.id}>
                    <Controller
                      name={`skillNames.${index}.skillName`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Field.Text
                          name={`skillNames.${index}.skillName`}
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
                          placeholder="Skill Name"
                          onChange={(e) => {
                            onChange(e.target.value);
                          }}
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
                New Skill Name
              </Button>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              reset({ id: null, name: '', orderNumber: '', skillNames: [] });
              onClose();
            }}
          >
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentSkill ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
