import { domMax, LazyMotion } from 'framer-motion';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------
export type TMotionLazyProps = {
  children: ReactNode;
};

export function MotionLazy({ children }: TMotionLazyProps) {
  return (
    <LazyMotion strict features={domMax}>
      {children}
    </LazyMotion>
  );
}
