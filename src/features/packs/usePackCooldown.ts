import { useCallback, useEffect, useRef, useState } from 'react';

import { PackTimerService } from '@/services/pack/PackTimerService';

function formatMs(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function usePackCooldown() {
  const [canOpen, setCanOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);
  const [formattedTime, setFormattedTime] = useState('00:00:00');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(async () => {
    const ready = await PackTimerService.canOpen();
    const ms = await PackTimerService.getRemainingMs();
    setCanOpen(ready);
    setRemainingMs(ms);
    setFormattedTime(formatMs(ms));
  }, []);

  useEffect(() => {
    void tick();
    intervalRef.current = setInterval(() => void tick(), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  return { canOpen, remainingMs, formattedTime, refresh: tick };
}
