const isServerSide =
  typeof window === "undefined" ||
  typeof document === "undefined" ||
  !window.location ||
  !window.document;
export default isServerSide;
