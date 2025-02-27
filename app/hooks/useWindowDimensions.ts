import { useEffect, useState } from "react";
import { debounce } from "lodash";

function useWindowDimensions(bouncer?: number) {
  bouncer = bouncer ?? 200;
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  useEffect(() => {
    //needed because on default state window object is not available
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, bouncer);
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);
  return dimensions;
}

export default useWindowDimensions;
