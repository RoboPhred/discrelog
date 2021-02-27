import * as React from "react";

import { cls } from "@/utils";

import Checkbox from "@/components/Checkbox";

import styles from "./Menus.module.css";

export interface CheckboxMenuItemProps {
  disabled?: boolean;
  secondary?: string;
  value: boolean;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}
const CheckboxMenuItem: React.FC<CheckboxMenuItemProps> = ({
  disabled,
  secondary,
  value,
  onChange,
  children,
}) => {
  return (
    <li
      className={cls(
        styles["menu-item"],
        disabled && styles["menu-item--disabled"]
      )}
    >
      <Checkbox
        className={styles["menu-item-content"]}
        value={value}
        onChange={onChange}
      >
        <span className={styles["menu-item-text"]}>{children}</span>
        {secondary && (
          <span className={styles["menu-item-secondary"]}>{secondary}</span>
        )}
      </Checkbox>
    </li>
  );
};

export default CheckboxMenuItem;
