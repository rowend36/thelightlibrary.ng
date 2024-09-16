import { useRef } from "react";
import isServerSide from "./isServerSide";

export default function useWindowRef() {
  return useRef(isServerSide ? null : (window as Window));
}
