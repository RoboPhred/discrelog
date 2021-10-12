import * as React from "react";

import { cls } from "@/utils";

import styles from "./Menus.module.css";
import { useMenuCloseContext } from "./MenuCloseContext";

export interface MenuItemProps {
  disabled?: boolean;
  secondary?: string;
  onClick?(e: React.MouseEvent<HTMLElement>): void;
}
const MenuItem: React.FC<MenuItemProps> = ({
  disabled,
  onClick,
  secondary,
  children,
}) => {
  const requestMenuClose = useMenuCloseContext();
  const onItemClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (onClick) {
        onClick(e);
      }
      requestMenuClose();
    },
    [requestMenuClose, onClick]
  );
  return (
    <li
      className={cls(
        styles["menu-item"],
        disabled && styles["menu-item--disabled"]
      )}
      onClick={onItemClick}
    >
      <a className={styles["menu-item-content"]}>
        <span className={styles["menu-item-text"]}>{children}</span>
        {secondary && (
          <span className={styles["menu-item-secondary"]}>{secondary}</span>
        )}
      </a>
    </li>
  );
};

export default MenuItem;
