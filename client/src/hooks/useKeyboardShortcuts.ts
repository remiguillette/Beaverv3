
import { useEffect } from 'react';

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const altMatch = !!shortcut.alt === event.altKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
