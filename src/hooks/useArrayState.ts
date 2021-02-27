import * as React from "react";
import difference from "lodash/difference";

export type UseArrayState<T> = [
  items: T[],
  addItem: (value: T) => void,
  removeItem: (value: T) => void,
  setItems: (items: T[]) => void
];

export function useArrayState<T>(defaultValue: T[] = []): UseArrayState<T> {
  const [items, setItems] = React.useState(defaultValue);
  const addItem = React.useCallback(
    (item: T) => {
      setItems([...items, item]);
    },
    [items]
  );
  const removeItem = React.useCallback(
    (item: T) => {
      setItems(difference(items, [item]));
    },
    [items]
  );

  return [items, addItem, removeItem, setItems];
}
