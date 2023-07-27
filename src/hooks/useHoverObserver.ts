import { useEffect, useState } from 'react';

interface MutationObserverInit {
  attributes?: boolean;
  childList?: boolean;
  subtree?: boolean;
  attributeOldValue?: boolean;
}

export const useHoverObserver = (
  selector: string,
  observerOptions?: MutationObserverInit,
) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const handleMutation = () => {
      const hasHoverClass = document.querySelector(selector) !== null;
      setIsHovered(hasHoverClass);
    };

    const observer = new MutationObserver(handleMutation);

    observer.observe(document, {
      attributes: true, // Watch for attribute changes
      subtree: true, // Observe all descendants, not just the document root
      ...observerOptions, // Allow customizing observer options
    });

    return () => {
      observer.disconnect();
    };
  }, [selector, observerOptions]);

  return isHovered;
};
