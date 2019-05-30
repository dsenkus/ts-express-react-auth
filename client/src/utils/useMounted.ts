import { useRef, useEffect } from "react";

/**
 * helper function to determine if component is still mounted. Usage:
 * 
 * const mounted = useMounted();
 * ...
 * if(mounted.current) {
 *   // component still mounted
 * }
 */
export const useMounted = () => {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    }
  })

  return mounted;
}
