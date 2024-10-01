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
      if (Date.now() - startTimeRef.current > 5000) {
        setHoldTime(5000);
        setIsHolding(false);
        window.clearInterval(timerRef.current || undefined);
      }
      setHoldTime(Date.now() - startTimeRef.current);
    }, 10);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (timerRef.current !== null) {
      setIsHolding(false);
      window.clearInterval(timerRef.current);
      setHoldTime(Date.now() - startTimeRef.current);

      setInterval(() => {
        if (holdTime <= 0) return;
        setHoldTime((holdTime) => holdTime - 10);
      }, 10);
    }
  }, [holdTime]);

  return { holdTime, isHolding, handleMouseDown, handleMouseUp };
};
