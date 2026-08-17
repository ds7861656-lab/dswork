import { useState, useEffect, useCallback } from 'react';

interface UseCountdownReturn {
  timeLeft: number;
  isActive: boolean;
  startCountdown: (seconds?: number) => void;
  resetCountdown: () => void;
}

export const useCountdown = (initialSeconds: number = 60): UseCountdownReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, timeLeft]);

  const startCountdown = useCallback((seconds: number = initialSeconds) => {
    setTimeLeft(seconds);
    setIsActive(true);
  }, [initialSeconds]);

  const resetCountdown = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
  }, []);

  return { timeLeft, isActive, startCountdown, resetCountdown };
};

export default useCountdown;