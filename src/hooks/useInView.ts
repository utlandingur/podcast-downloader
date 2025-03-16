import { RefObject, useEffect, useState } from 'react';

export const useOutOfView = <T extends HTMLElement>(
  ref: RefObject<T>,
  active: boolean,
) => {
  const [isOutOfView, setIsOutOfView] = useState(false);
  const [isOutOfViewLeft, setIsOutOfViewLeft] = useState(false);
  const [isOutOfViewRight, setIsOutOfViewRight] = useState(false);

  useEffect(() => {
    const checkIfOutOfView = () => {
      if (ref.current !== null) {
        const rect = ref.current.getBoundingClientRect();
        const isOutOfViewTop = rect.top < 0;
        const isOutOfViewBottom = rect.bottom > window.innerHeight;
        const isOutOfViewLeft = rect.left < 0;
        const isOutOfViewRight = rect.right > window.innerWidth;

        setIsOutOfView(
          isOutOfViewTop ||
            isOutOfViewBottom ||
            isOutOfViewLeft ||
            isOutOfViewRight,
        );
        setIsOutOfViewLeft(isOutOfViewLeft);
        setIsOutOfViewRight(isOutOfViewRight);
      }
    };

    if (active) {
      checkIfOutOfView();
      window.addEventListener('scroll', checkIfOutOfView);
      window.addEventListener('resize', checkIfOutOfView);
    }

    return () => {
      window.removeEventListener('scroll', checkIfOutOfView);
      window.removeEventListener('resize', checkIfOutOfView);
    };
  }, [active, ref]);

  return { isOutOfView, isOutOfViewLeft, isOutOfViewRight };
};
