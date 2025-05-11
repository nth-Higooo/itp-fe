import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------
export type TCustomBreadcrumbsProps = BoxProps & {
  action?: any;
  heading?: any;
  moreLink?: any;
  activeLast?: any;
  slotProps?: any;
};

export function CustomBreadcrumbs({
  action,
  heading,
  moreLink,
  activeLast,
  slotProps,
  sx,
  ...other
}: TCustomBreadcrumbsProps) {
  const renderHeading = (
    <Typography variant="h4" sx={{ ...slotProps?.heading }}>
      {heading}
    </Typography>
  );

  const renderAction = <Box sx={{ flexShrink: 0, ...slotProps?.action }}> {action} </Box>;

  const renderMoreLink = (
    <Box component="ul">
      {moreLink?.map((href: string) => (
        <Box key={href} component="li" sx={{ display: 'flex' }}>
          <Link href={href} variant="body2" target="_blank" rel="noopener" sx={slotProps?.moreLink}>
            {href}
          </Link>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box gap={2} display="flex" flexDirection="column" sx={{ ...sx, mb: 2 }} {...other}>
      <Box display="flex" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>{heading && renderHeading}</Box>

        {action && renderAction}
      </Box>

      {!!moreLink && renderMoreLink}
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
