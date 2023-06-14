import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';

export const useContainerWidth = (stopWidth = 0) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth);
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      if (window.innerWidth > stopWidth) {
        setContainerWidth(containerRef.current?.clientWidth);
      }
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [stopWidth]);

  return {
    containerWidth,
    containerRef,
  };
};
