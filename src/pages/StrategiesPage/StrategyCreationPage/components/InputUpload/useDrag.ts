import { useCallback, useEffect } from 'react';

export const useDrag = (ref) => {
  const handleDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      ref.current.style.borderColor = '#007aff';
    },
    [ref],
  );
  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      ref.current.style.borderColor = '#aeaeb2';
    },
    [ref],
  );

  useEffect(() => {
    const drop = ref.current;
    drop.addEventListener('dragenter', handleDragEnter);
    drop.addEventListener('dragleave', handleDragLeave);

    return () => {
      drop.removeEventListener('dragenter', handleDragEnter);
      drop.removeEventListener('dragleave', handleDragLeave);
    };
  }, [ref, handleDragEnter, handleDragLeave]);
};
