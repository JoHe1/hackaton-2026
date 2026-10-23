import { useEffect, useRef, useState } from 'react';

/** Scale factor (≤ 1) that fits a `width × height` box inside the observed element. */
export function useFitScale<T extends HTMLElement>(width: number, height: number) {
  const ref = useRef<T>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const { clientWidth, clientHeight } = element;
      setScale(Math.min(1, clientWidth / width, clientHeight / height));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, height]);
  return { ref, scale };
}
