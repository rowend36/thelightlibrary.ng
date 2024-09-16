import { useRef, useEffect, RefObject } from "react";
export default function useListener<K extends EventTarget>(
  ref: RefObject<K>,
  event: string,
  _handler: (this: K, event: Event) => void,
  opts?: AddEventListenerOptions | boolean
) {
  const handler = useRef(_handler);
  handler.current = _handler;
  useEffect(
    function () {
      if (ref.current) {
        const el = ref.current;
        const cb = function (this: K, event: Event) {
          handler.current.call(this, event);
        } as EventListener;
        el.addEventListener(event, cb, opts);
        return function () {
          el.removeEventListener(event, cb, opts);
        };
      }
    },
    [ref, event, opts]
  );
}
