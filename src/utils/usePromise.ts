import { DependencyList, useMemo } from "react";
import { useState, useEffect, useRef } from "react";

export default function usePromise<T>(
  createPromise: () => Promise<T>,
  deps: DependencyList
) {
  const [, setData] = useState<unknown>();
  const ref = useRef<T>();
  const cb = useMemo(
    function () {
      ref.current = undefined;
      return createPromise;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps]
  );
  useEffect(
    function () {
      let stale = false;
      const promise = cb();
      if (!promise) return;
      promise.then(
        function (data) {
          if (!stale) {
            if (data !== ref.current) {
              ref.current = data;
              setData({});
            }
          }
        },
        function (e) {
          console.error(e);
        }
      );
      return function () {
        stale = true;
      };
    },
    [cb]
  );
  return ref.current;
}
