import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import { useViewportStore } from '@/store/viewport';

const useClickOutSide = (
  el: RefObject<HTMLElement | null>,
  set: Dispatch<SetStateAction<boolean>>,
  isOnlyPc?: boolean,
) => {
  const isPc = useViewportStore((state) => state.isPc);

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent): void => {
      if (
        !el.current?.contains(target as Node) &&
        (!isOnlyPc || (isPc && isOnlyPc))
      ) {
        set(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useClickOutSide;
