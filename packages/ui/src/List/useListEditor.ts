import { useEffect, useRef, useState } from 'react';

import type { ListItemMethods } from './ListItem';
import { useIsFocused } from '@react-navigation/native';

export const useListEditor = () => {
  const isFocused = useIsFocused();

  // References are indexed by group and then ordinal index in the group.
  // Groups allow multiple lists on the same screen all responding to the
  // single editor instance.
  const liRef = useRef<Record<string, ListItemMethods[]>>({});
  const [listEditSwipeEnabled, setListEditSwipeEnabled] = useState(false);
  const [listEditModeEnabled, setListEditModeEnabled] = useState(false);

  // Reset the editor when the screen loses focus (navigate away).
  useEffect(() => {
    !isFocused && resetEditor();
    setListEditModeEnabled(false);
    setListEditSwipeEnabled(false);
  }, [isFocused]);

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

  const onSwipeableWillOpen = (group: string, index: number) => {
    Object.keys(liRef.current).forEach(g => {
      (liRef.current[g] as ListItemMethods[]).forEach((li, i) => {
        console.log(g, i);
        console.log(group, index);
        !(g === group && i === index) && li.resetEditor();
      });
    });

    // Need to allow the editor resets to run first.
    setTimeout(() => {
      setListEditSwipeEnabled(true);
    });
  };

  const onSwipeableWillClose = () => {
    setListEditSwipeEnabled(false);
  };

  // Add the reference to the editor by group. The group is used to allow
  // multiple lists on the same screen, each list should have a different
  // group name.
  const addToEditor = (
    ref: ListItemMethods | null,
    group: string,
    index: number,
  ) => {
    if (ref) {
      if (!liRef.current[group]) {
        liRef.current = {
          ...liRef.current,
          [group]: [],
        };
      }
      liRef.current[group][index] = ref;
    }
  };

  const resetEditor = () => {
    Object.keys(liRef.current).forEach(group => {
      liRef.current[group].forEach(li => {
        li.resetEditor();
      });
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
