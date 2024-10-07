import { useEffect } from "react";
import {
  NavigationType,
  useLocation,
  useNavigationType,
} from "react-router-dom";

function ScrollToTop() {
  const pathname = useLocation().pathname;
  const action = useNavigationType();
  console.log(action, pathname);
  useEffect(() => {
    if (action !== NavigationType.Pop) window.scrollTo(0, 0);
  }, [pathname, action]);

  return null;
}

export default ScrollToTop;
