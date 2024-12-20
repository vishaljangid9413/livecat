import { useState, useRef, useCallback } from "react";

function useImmediateState<T>(
  initialValue: T
): [T,  (newValue: T | ((prevState: T) => T)) => T] {
  const [_, setState] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setImmediateState = useCallback((newValue: T | ((prevState: T) => T)) => {
    const computedValue =
    typeof newValue === "function" ? (newValue as (prevState: T) => T)(ref.current) : newValue;

    ref.current = computedValue; 
    setState(computedValue); 
    return ref.current
  }, []);

  return [ref.current, setImmediateState];
}

export default useImmediateState;
