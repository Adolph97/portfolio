import React, { useEffect, useRef, useState } from 'react';

/**
 * Deletes back to the shared prefix, then types the new text. The first text
 * shows straight away so the headline is never empty. Purely visual: the hero's
 * h1 carries the readable copy.
 */
const Typewriter: React.FC<{ text: string; animate: boolean; className?: string }> = ({ text, animate, className }) => {
  const [shown, setShown] = useState(text);
  const shownRef = useRef(text);

  useEffect(() => {
    const set = (v: string) => {
      shownRef.current = v;
      setShown(v);
    };
    if (!animate) {
      set(text);
      return;
    }
    let timer = 0;
    const step = () => {
      const cur = shownRef.current;
      if (cur === text) return;
      let common = 0;
      while (common < cur.length && cur[common] === text[common]) common++;
      const deleting = cur.length > common;
      set(deleting ? cur.slice(0, -1) : text.slice(0, cur.length + 1));
      timer = window.setTimeout(step, deleting ? 16 : 34 + Math.random() * 30);
    };
    timer = window.setTimeout(step, 120);
    return () => window.clearTimeout(timer);
  }, [text, animate]);

  return (
    <span className={className}>
      {shown}
      <span className="type-caret" />
    </span>
  );
};

export default Typewriter;
