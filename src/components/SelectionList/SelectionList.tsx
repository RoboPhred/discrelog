import * as React from "react";

import { cls } from "@/utils";

import interaction from "@/styles/interaction.module.css";

import styles from "./SelectionList.module.css";

export interface SelectionListItem {
  id?: string;
  value: string;
  label: React.ReactNode;
  isSelected?: boolean;
}

export interface SelectionListProps {
  className?: string;
  id?: string;
  items: SelectionListItem[];
  onItemSelected(value: string): void;
}

const SelectionList: React.FC<SelectionListProps> = ({
  className,
  id,
  items,
  onItemSelected,
}) => {
  return (
    <ul
      id={id}
      className={cls("selection-list", styles["selection-list"], className)}
    >
      {items.map((item) => (
        <SelectionListItem
          key={item.value}
          {...item}
          onItemSelected={onItemSelected}
        />
      ))}
    </ul>
  );
};

export default SelectionList;

interface SelectionListItemProps extends SelectionListItem {
  onItemSelected(value: string): void;
}

const SelectionListItem: React.FC<SelectionListItemProps> = ({
  id,
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
      id={id}
      className={cls(
        "selection-list-item",
        styles["selection-list-item"],
        isSelected && styles["selection-list-item--selected"]
      )}
      onClick={onClick}
    >
      <div
        className={cls(
          styles["selection-list-item-content"],
          interaction["text-unselectable"]
        )}
      >
        {label}
      </div>
    </li>
  );
};
