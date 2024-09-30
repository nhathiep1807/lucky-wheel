import { useState, useCallback, useRef } from "react";

export const useTrackTime = () => {
  const [holdTime, setHoldTime] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const handleMouseDown = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsHolding(true);
    timerRef.current = window.setInterval(() => {
      setHoldTime(Date.now() - startTimeRef.current);
    }, 10);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (timerRef.current !== null) {
      setIsHolding(false);
      window.clearInterval(timerRef.current);
      setHoldTime(Date.now() - startTimeRef.current);

      setTimeout(() => {
        setHoldTime(0);
      }, holdTime);
    }
  }, [holdTime]);

  return { holdTime, isHolding, handleMouseDown, handleMouseUp };
};
