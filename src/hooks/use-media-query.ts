import { useEffect, useState } from 'react';

// Define the hook with 'query' parameter typed as a string
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Define the listener as a separate function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    media.addEventListener('change', listener);

    // Cleanup function
    return () => media.removeEventListener('change', listener);
  }, [query, mounted]);

  // Return false during SSR to avoid hydration mismatch
  if (!mounted) {
    return false;
  }

  return matches;
};

export default useMediaQuery;
