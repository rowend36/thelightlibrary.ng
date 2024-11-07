import { useRef } from "react";
/**
 * Wraps a function that changes every render with a stable reference that does not trigger updates in dependency arrays
 * @returns {Function} stable_callback
 */
export default function useStable<T extends unknown[], V>(
  func: ((...args: T) => V) | null,
  wrapper = <T>(e: T) => e
) {
  const ref = useRef({
    cb: wrapper((...args: T) => ref.current.handler?.(...args)),
    handler: func,
  });
  ref.current.handler = func;
  return func && ref.current.cb;
}
