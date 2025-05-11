import { useRef, useEffect } from 'react';
import { m, animate, useInView, useTransform, useMotionValue } from 'framer-motion';

import Typography, { TypographyProps } from '@mui/material/Typography';

// ----------------------------------------------------------------------
export type TAnimateCountUpProps = TypographyProps & {
  to?: any;
  from?: any;
  toFixed?: any;
  once?: any;
  duration?: any;
  amount?: any;
  unit?: any;
};

export function AnimateCountUp({
  to,
  sx,
  from = 0,
  toFixed = 0,
  once = true,
  duration = 2,
  amount = 0.5,
  unit: unitProp,
  component = 'p',
  ...other
}: TAnimateCountUpProps) {
  const ref = useRef(null);

  const shortNumber = shortenNumber(to);

  const startCount = useMotionValue(from);

  const endCount = shortNumber ? shortNumber.value : to;

  const unit = unitProp ?? shortNumber?.unit;

  const inView = useInView(ref, { once, amount });

  const rounded = useTransform(startCount, (latest) =>
    latest.toFixed(isFloat(latest) ? toFixed : 0)
  );

  useEffect(() => {
    if (inView) {
      animate(startCount, endCount, { duration });
    }
  }, [duration, endCount, inView, startCount]);

  return (
    <Typography
      component={component}
      sx={{
        p: 0,
        m: 0,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <m.span ref={ref}>{rounded}</m.span>
      {unit}
    </Typography>
  );
}

// ----------------------------------------------------------------------

function isFloat(n: unknown) {
  return typeof n === 'number' && !Number.isInteger(n);
}

function shortenNumber(num: number) {
  if (num >= 1e9) {
    return { unit: 'b', value: num / 1e9 };
  }
  if (num >= 1e6) {
    return { unit: 'm', value: num / 1e6 };
  }
  if (num >= 1e3) {
    return { unit: 'k', value: num / 1e3 };
  }
  return undefined;
}
