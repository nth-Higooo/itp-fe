import { useMemo, useState, useEffect, useCallback } from 'react';

import { isEqual } from 'src/utils/helper';
import { localStorageGetItem } from 'src/utils/storage-available';

// ----------------------------------------------------------------------

export function useLocalStorage(key: string, initialState: any) {
  const [state, set] = useState<any>(initialState);

  const multiValue = initialState && typeof initialState === 'object';

  const canReset = !isEqual(state, initialState);

  useEffect(() => {
    const restoredValue = getStorage(key);

    if (restoredValue) {
      if (multiValue) {
        set((prevValue: any) => ({ ...prevValue, ...restoredValue }));
      } else {
        set(restoredValue);
      }
    }
  }, [key, multiValue]);

  const setState = useCallback(
    (updateState: any) => {
      if (multiValue) {
        set((prevValue: any) => {
          setStorage(key, { ...prevValue, ...updateState });
          return { ...prevValue, ...updateState };
        });
      } else {
        setStorage(key, updateState);
        set(updateState);
      }
    },
    [key, multiValue]
  );

  const setField = useCallback(
    (name: any, updateValue: any) => {
      if (multiValue) {
        setState({
          [name]: updateValue,
        });
      }
    },
    [multiValue, setState]
  );

  const resetState = useCallback(() => {
    set(initialState);
    removeStorage(key);
  }, [initialState, key]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      resetState,
      canReset,
    }),
    [canReset, resetState, setField, setState, state]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function getStorage(key: string) {
  try {
    const result = localStorageGetItem(key);

    if (result) {
      return JSON.parse(result);
    }
  } catch (error) {
    console.error('Error while getting from storage:', error);
  }

  return null;
}

// ----------------------------------------------------------------------

export function setStorage(key: string, value: any) {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error while setting storage:', error);
  }
}

// ----------------------------------------------------------------------

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error while removing from storage:', error);
  }
}
