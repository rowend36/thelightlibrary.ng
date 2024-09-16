import { useMotionValue, useScroll, useTransform } from "framer-motion";
import isServerSide from "./isServerSide";
import { RefObject, useEffect } from "react";

class Offset {
  abs: number;
  ratio: number;
  constructor(abs: number, ratio: number) {
    this.abs = abs;
    this.ratio = ratio;
  }
}
/**
 *
 * @param {import("react").Ref<HTMLElement>} ref
 * @returns
 */
export function useOffsetInfo(
  ref: RefObject<HTMLElement>,
  scrollRoot = isServerSide ? null : document.scrollingElement
) {
  const { scrollY } = useScroll();
  const update = () => {
    /**@type {HTMLElement} */
    const m = ref.current;
    if (m && scrollRoot) {
      const rect = m.getBoundingClientRect();
      const h = rect.height;
      const H = window.innerHeight;
      const y =
        scrollRoot.scrollHeight -
        scrollRoot.clientHeight -
        scrollRoot.scrollTop;
      const abs = Math.min(rect.top + ((h - H) >> 1), y);
      const ratio = abs / ((h + H) >> 1);
      return new Offset(abs, ratio);
    }
    return new Offset(0, 0);
  };
  return useTransform([scrollY], update);
}

export function useFirstUpdate() {
  const firstUpdate = useMotionValue(false);
  useEffect(() => {
    firstUpdate.set(true);
    return () => firstUpdate.set(false);
  }, [firstUpdate]);
  return firstUpdate;
}

export function useDeviation(ref: RefObject<HTMLElement>) {
  return useTransform(useOffsetInfo(ref), (e) => e.ratio);
}
export default function useDistanceFromIdeal(ref: RefObject<HTMLElement>) {
  return useTransform(useOffsetInfo(ref), (e) => e.abs);
}
