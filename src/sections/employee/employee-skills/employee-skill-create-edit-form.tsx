import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { EmployeeSkillRequest } from 'src/data/skill/skill.model';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { getAllSkillTypeAsync } from 'src/services/selection.service';
import { addEmployeeSkillAsync, updateEmployeeSkillAsync } from 'src/services/skill/skill.service';

export type TSkillCreateEditFormProps = {
  currentSkill?: any;
  open: boolean;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
  employeeId: string;
};

export function SkillCreateEditForm({
  currentSkill,
  open,
  onClose = () => {},
  employeeId,
  onSubmitSuccess = () => {},
}: TSkillCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const { skillTypes, getSkillTypeStatus } = useAppSelector(selectSelections);
  const [selectedSkillTypeId, setSelectedSkillTypeId] = useState<string | ''>('');
  const [selectedSkillNameId, setSelectedSkillNameId] = useState<string | ''>('');
  const methods = useForm({
    mode: 'all',
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSkillTypeChange = (event: any) => {
    const selectedSkillTypeId = event.target.value;
    setValue('skillType', selectedSkillTypeId);
    setSelectedSkillTypeId(selectedSkillTypeId);
  };
  const onSkillNameChange = (event: any) => {
    const selectedSkillNameId = event.target.value;
    setValue('skillName', selectedSkillNameId);
    setSelectedSkillNameId(selectedSkillNameId);
  };

  useEffect(() => {
    if (open) {
      if (currentSkill) {
        const skillTypeId = currentSkill.skillLevel?.skillType?.parentId || '';
        const skillNameId = currentSkill.skillLevel?.skillType?.id || '';

        if (skillTypes.find((type) => type.id === skillTypeId)) {
          setSelectedSkillTypeId(skillTypeId);
          setValue('skillType', skillTypeId);
        } else {
          setSelectedSkillTypeId('');
          setValue('skillType', '');
        }

        if (
          skillTypes
            .find((type) => type.id === skillTypeId)
            ?.skillNames.find((name) => name.id === skillNameId)
        ) {
          setSelectedSkillNameId(skillNameId);
          setValue('skillName', skillNameId);
        } else {
          setSelectedSkillNameId('');
          setValue('skillName', '');
        }

        reset({
          employeeId,
          isMainSkill: currentSkill.isMainSkill || false,
          id: currentSkill.id || '',
          skillType: currentSkill.skillLevel?.skillType?.parentId || '',
          skillName: currentSkill.skillLevel?.skillType?.id || '',
          skillLevel: currentSkill.skillLevel?.id || '',
        });
      } else {
        reset({
          isMainSkill: false,
          id: '',
          skillType: '',
          skillName: '',
          skillLevel: '',
        });
      }
    }
  }, [currentSkill, reset, open]);

  useEffect(() => {
    if (getSkillTypeStatus === 'idle') {
      dispatch(getAllSkillTypeAsync());
    }
  }, [dispatch]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const payload: EmployeeSkillRequest = {
        ...data,
        id: data.id,
        employeeId: employeeId,
        isMainSkill: data.isMainSkill,
        skillLevelId: data.skillLevel,
      };
      console.log('payload', payload);
      if (!currentSkill) {
        const response = await dispatch(addEmployeeSkillAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add new skill successfully!');
          onClose();
          onSubmitSuccess();
        }
      } else {
        const response = await dispatch(updateEmployeeSkillAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update skill successfully!');
          onClose();
          onSubmitSuccess();
        }
      }
      // onSubmitSuccess();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <FormProvider {...methods}>
        <Form methods={methods} onSubmit={onSubmit}>
          <DialogTitle>{currentSkill ? 'Update Skill' : 'Create New Skill'}</DialogTitle>

          <DialogContent>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              sx={{ paddingTop: 2 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
            >
              <Field.Switch
                name="isMainSkill"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Set main skill{' '}
                    </Typography>
                  </>
                }
                checked={methods.getValues('isMainSkill') || false}
                onChange={(e: { target: { checked: any } }) => {
                  setValue('isMainSkill', e.target.checked);
                }}
              />

              <Field.Select
                name="skillType"
                label="Skill Type"
                rules={{ required: 'Skill type is required.' }}
                onChange={onSkillTypeChange}
                sx={{ gridColumn: 'span 2' }}
              >
                {skillTypes.map((option: any) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              sx={{ paddingTop: 2 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <Field.Select
                name="skillName"
                label="Skill Name"
                rules={{ required: 'Skill name is required.' }}
                onChange={onSkillNameChange}
                disabled={!selectedSkillTypeId}
              >
                {skillTypes
                  .find((type) => type.id === selectedSkillTypeId)
                  ?.skillNames.map((skillName) => (
                    <MenuItem key={skillName.id} value={skillName.id}>
                      {skillName.skillName}
                    </MenuItem>
                  ))}
              </Field.Select>
              <Field.Select
                name="skillLevel"
                label="Skill Level"
                rules={{ required: 'Skill level is required.' }}
                disabled={!selectedSkillNameId}
              >
                {skillTypes
                  ?.find((type) => type.id === selectedSkillTypeId)
                  ?.skillNames.find((name) => name.id === selectedSkillNameId)
                  ?.levels?.map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.level}
                    </MenuItem>
                  )) || (
                  <MenuItem value="" disabled>
                    No skill levels available
                  </MenuItem>
                )}
              </Field.Select>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentSkill ? 'Update' : 'Create'}
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormProvider>
    </Dialog>
  );
}
