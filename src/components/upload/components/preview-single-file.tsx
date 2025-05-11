import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';
import { TTheme } from 'src/theme/create-theme';

// ----------------------------------------------------------------------

export function SingleFilePreview({ file, sx, className, ...other }: any) {
  const fileName = typeof file === 'string' ? file : file.name;

  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  return (
    <Box
      className={uploadClasses.uploadSinglePreview.concat(className ? ` ${className}` : '')}
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt={fileName}
        src={previewUrl}
        sx={{
          width: 1,
          height: 1,
          borderRadius: 1,
          objectFit: 'cover',
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }: any) {
  return (
    <IconButton
      size="small"
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme: TTheme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
        bgcolor: (theme: TTheme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.72),
        '&:hover': {
          bgcolor: (theme: TTheme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
