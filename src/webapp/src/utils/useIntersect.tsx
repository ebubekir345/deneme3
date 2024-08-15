import { useRef, useState, useEffect } from 'react';

// For more info:
// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
const useIntersect = ({ root = null, rootMargin = '0px', threshold = 0 }: IntersectionObserverInit) => {
  const [entry, updateEntry] = useState<any>();
  const [node, setNode] = useState(null);

  const observer = useRef(
    // eslint-disable-next-line no-shadow
    new window.IntersectionObserver(([entry]) => updateEntry(entry), {
      root,
      rootMargin,
      threshold,
    })
  );

  useEffect(() => {
    const { current: currentObserver } = observer;
    currentObserver.disconnect();

    if (node) currentObserver.observe(node as any);

    return () => currentObserver.disconnect();
  }, [node]);

  return [setNode, entry];
};

export default useIntersect;
