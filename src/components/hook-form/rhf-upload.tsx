import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { Upload, UploadBox, UploadAvatar } from '../upload';
import { uploadImage } from 'src/services/employee/employee.service';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ rules, name, ...other }: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = async (acceptedFiles: File[]) => {
          const value = {
            file: acceptedFiles[0],
            fileURL: URL.createObjectURL(acceptedFiles[0]),
          };

          // const imageLink = await uploadImage(value);
          setValue(name, value, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar
              value={typeof field.value === 'string' ? field.value : field.value?.fileURL}
              error={!!error}
              onDrop={onDrop}
              {...other}
            />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ rules, name, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ rules, name, multiple, helperText, onDelete, ...other }: any) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = async (acceptedFiles: File[]) => {
          const value = {
            file: acceptedFiles[0],
            fileURL: URL.createObjectURL(acceptedFiles[0]),
          };

          // const imageLink = await uploadImage(oneValue);

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Upload
            {...uploadProps}
            value={typeof field.value === 'string' ? field.value : field.value?.fileURL}
            onDrop={onDrop}
            {...other}
            onDelete={onDelete}
          />
        );
      }}
    />
  );
}
