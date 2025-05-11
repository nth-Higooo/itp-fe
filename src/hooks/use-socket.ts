import { useMemo, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const socket = io(CONFIG.serverUrl, { withCredentials: true });

// ----------------------------------------------------------------------

export function useSocket(eventName: string) {
  const [data, set] = useState<any>(undefined);

  useEffect(() => {
    socket.on(eventName, (arg) => {
      set(arg);
    });
    return () => {
      socket.off(eventName);
    };
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...data,
    }),
    [data]
  );

  return memoizedValue;
}
