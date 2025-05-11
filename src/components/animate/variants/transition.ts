// ----------------------------------------------------------------------
export type TvarTranProps = {
  duration?: number;
  ease?: number[];
  durationIn?: any;
  easeIn?: any;
  durationOut?: any;
  easeOut?: any;
};
export const varTranHover = (props: TvarTranProps) => {
  const duration = props?.duration || 0.32;
  const ease = props?.ease || [0.43, 0.13, 0.23, 0.96];

  return { duration, ease };
};

export const varTranEnter = (props: TvarTranProps) => {
  const duration = props?.durationIn || 0.64;
  const ease = props?.easeIn || [0.43, 0.13, 0.23, 0.96];

  return { duration, ease };
};

export const varTranExit = (props: TvarTranProps) => {
  const duration = props?.durationOut || 0.48;
  const ease = props?.easeOut || [0.43, 0.13, 0.23, 0.96];

  return { duration, ease };
};
