import Paper, { PaperProps } from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------
type TKanbanColumnSkeletonProps = PaperProps & {
  amount?: number;
};

export function KanbanColumnSkeleton({ amount = 3, sx, ...other }: TKanbanColumnSkeletonProps) {
  return [...Array(amount)].map((_, index) => (
    <Paper
      key={index}
      variant="outlined"
      sx={{
        display: 'flex',
        gap: 'var(--item-gap)',
        flexDirection: 'column',
        p: 'var(--column-padding)',
        width: 'var(--column-width)',
        borderRadius: 'var(--column-radius)',
        ...sx,
      }}
      {...other}
    >
      <Skeleton sx={{ pt: '75%', borderRadius: 1.5 }} />
      {[0].includes(index) && <Skeleton sx={{ pt: '50%', borderRadius: 1.5 }} />}
      {[0, 1].includes(index) && <Skeleton sx={{ pt: '25%', borderRadius: 1.5 }} />}
      {[0, 1, 2].includes(index) && <Skeleton sx={{ pt: '25%', borderRadius: 1.5 }} />}
    </Paper>
  ));
}
