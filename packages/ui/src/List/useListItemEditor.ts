import { useRef, useState } from 'react';

import type { ListItemMethods } from './ListItem';

export const useListItemEditor = () => {
  const liRef = useRef<ListItemMethods[]>([]);
  const [listEditSwipeEnabled, setListEditSwipeEnabled] = useState(false);
  const [listEditModeEnabled, setListEditModeEnabled] = useState(false);

  const onEdit = () => {
    if (listEditSwipeEnabled) {
      setListEditSwipeEnabled(false);
      resetEditor();
    } else {
      if (listEditModeEnabled) {
        resetEditor();
      }
      setListEditModeEnabled(!listEditModeEnabled);
    }
  };

  const onSwipeableWillOpen = (index: number) => {
    liRef.current.forEach((li, i) => {
      i !== index && li.resetEditor();
    });

    // Need to allow the editor resets to run first.
    setTimeout(() => {
      setListEditSwipeEnabled(true);
    });
  };

  const onSwipeableWillClose = () => {
    setListEditSwipeEnabled(false);
  };

  const addToEditor = (ref: ListItemMethods | null, index: number) => {
    if (ref) {
      liRef.current[index] = ref;
    }
  };

  const resetEditor = () => {
    liRef.current.forEach(li => {
      li.resetEditor();
    });
  };

  return {
    enabled: listEditModeEnabled || listEditSwipeEnabled,
    show: listEditModeEnabled,
    enabledBySwipe: listEditSwipeEnabled,
    add: addToEditor,
    onEdit,
    onItemWillOpen: onSwipeableWillOpen,
    onItemWillClose: onSwipeableWillClose,
    reset: resetEditor,
  };
};
