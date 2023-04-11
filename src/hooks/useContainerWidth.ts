import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';

export const useContainerWidth = () => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth);
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      setContainerWidth(containerRef.current?.clientWidth);
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    containerWidth,
    containerRef,
  };
};
