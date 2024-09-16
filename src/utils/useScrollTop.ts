import { useRef, useState, useEffect, RefObject } from "react";
import useListener from "./useListener";
import useWindowRef from "./useWindowRef";
export default function useScrollTop<V>(
  ref: RefObject<HTMLElement> | null,
  initial: V = 0 as V,
  _reducer: (current: number, old: number, saved: V) => V
) {
  const windowRef = useWindowRef();
  const reducer = useRef(_reducer);
  reducer.current = _reducer;
  const scroll = useRef(0);
  const [state, setState] = useState(initial);

  const onChangeScroll = function (e: { target: HTMLElement | null }) {
    const old = scroll.current;
    const y = ref
      ? e.target?.scrollTop ?? 0
      : (document.scrollingElement || document.documentElement).scrollTop;
    if (old === y) {
      return;
    }
    scroll.current = y;
    setState(reducer.current(y, old, state));
  };
  useEffect(() => {
    if (ref && ref.current) onChangeScroll({ target: ref.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useListener(
    ref || (windowRef as RefObject<HTMLElement>),
    "scroll",
    onChangeScroll as EventListener
  );

  return state;
}
