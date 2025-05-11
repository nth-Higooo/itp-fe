import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { TTheme } from 'src/theme/create-theme';
import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------
export type TEmptyContentProps = StackProps & {
  imgUrl?: any;
  action?: any;
  filled?: any;
  slotProps?: any;
  description?: any;
};

export function EmptyContent({
  sx,
  imgUrl,
  action,
  filled,
  slotProps,
  description,
  title = 'No data',
  ...other
}: TEmptyContentProps) {
  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        px: 3,
        height: 1,
        ...(filled && {
          borderRadius: 2,
          bgcolor: (theme: TTheme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme: TTheme) =>
            `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt="empty content"
        src={imgUrl ?? `${CONFIG.assetsDir}/assets/icons/empty/ic-content.svg`}
        sx={{ width: 1, maxWidth: 160, ...slotProps?.img }}
      />

      {title && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            mt: 1,
            textAlign: 'center',
            ...slotProps?.title,
            color: 'text.disabled',
          }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            textAlign: 'center',
            color: 'text.disabled',
            ...slotProps?.description,
          }}
        >
          {description}
        </Typography>
      )}

      {action && action}
    </Stack>
  );
}
