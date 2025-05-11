import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { uploadClasses } from '../classes';
import { fileData } from '../../file-thumbnail';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------

export function RejectionFiles({ files, sx, className, ...other }: any) {
  if (!files.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      className={uploadClasses.uploadRejectionFiles.concat(className ? ` ${className}` : '')}
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        textAlign: 'left',
        borderStyle: 'dashed',
        borderColor: 'error.main',
        bgcolor: (theme: TTheme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        ...sx,
      }}
      {...other}
    >
      {files.map(({ file, errors }: any) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error: any) => (
              <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                - {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}
