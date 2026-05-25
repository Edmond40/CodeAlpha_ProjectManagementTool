import { useEffect, useCallback, useRef } from 'react';

type Shortcut = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  enabled?: boolean;
};

export function useKeyboard(shortcuts: Shortcut[]) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const s of shortcutsRef.current) {
      if (s.enabled === false) continue;
      
      const ctrlOrMeta = s.ctrl || s.meta;
      const matchCtrl = ctrlOrMeta ? (e.ctrlKey || e.metaKey) : true;
      const matchShift = s.shift ? e.shiftKey : !e.shiftKey;
      const matchAlt = s.alt ? e.altKey : !e.altKey;

      if (
        e.key.toLowerCase() === s.key.toLowerCase() &&
        matchCtrl &&
        matchShift &&
        matchAlt
      ) {
        e.preventDefault();
        e.stopPropagation();
        s.handler();
        return;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
