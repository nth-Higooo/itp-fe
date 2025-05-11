import { useMemo, useState, useCallback } from 'react';

import { isEqual } from 'src/utils/helper';

// ----------------------------------------------------------------------

export function useSetState(initialState: any) {
  const [state, set] = useState(initialState);

  const canReset = !isEqual(state, initialState);

  const setState = useCallback((updateState: any) => {
    set((prevValue: any) => ({ ...prevValue, ...updateState }));
  }, []);

  const setField = useCallback(
    (name: any, updateValue: any) => {
      setState({
        [name]: updateValue,
      });
    },
    [setState]
  );

  const onResetState = useCallback(() => {
    set(initialState);
  }, [initialState]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      onResetState,
      canReset,
    }),
    [canReset, onResetState, setField, setState, state]
  );

  return memoizedValue;
}
