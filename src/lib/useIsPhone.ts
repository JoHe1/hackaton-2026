import { useEffect, useState } from 'react';

const PHONE_MAX_WIDTH = 500;
const query = `(max-width: ${PHONE_MAX_WIDTH}px)`;

/** True on a real phone: role routes then render full screen instead of a drawn device. */
export function useIsPhone(): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return matches;
}
