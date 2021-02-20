import * as React from "react";

import { cls } from "@/utils";

import styles from "./SelectionList.module.css";

export interface SelectionListItem {
  value: string;
  label: React.ReactNode;
  isSelected?: boolean;
}

export interface SelectionListProps {
  className?: string;
  items: SelectionListItem[];
  onItemSelected(value: string): void;
}

const SelectionList: React.FC<SelectionListProps> = ({
  className,
  items,
  onItemSelected,
}) => {
  return (
    <ul className={cls("selection-list", styles["selection-list"], className)}>
      {items.map((item) => (
        <SelectionListItemNode
          key={item.value}
          {...item}
          onItemSelected={onItemSelected}
        />
      ))}
    </ul>
  );
};

export default SelectionList;

interface SelectionListItemNodeProps extends SelectionListItem {
  onItemSelected(value: string): void;
}

const SelectionListItemNode: React.FC<SelectionListItemNodeProps> = ({
  value,
  label,
  isSelected,
  onItemSelected,
}) => {
  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();
      onItemSelected(value);
    },
    [onItemSelected, value]
  );

  return (
    <li
      className={cls(
        "selection-list-item",
        styles["selection-list-item"],
        isSelected && styles["selection-list-item--selected"]
      )}
      onClick={onClick}
    >
      <div className={styles["selection-list-item-content"]}>{label}</div>
    </li>
  );
};
