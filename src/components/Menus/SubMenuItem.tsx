import * as React from "react";

import { cls } from "@/utils";

import AutoPopover from "@/components/AutoPopover";

import styles from "./Menus.module.css";

export interface SubMenuItemProps {
  disabled?: boolean;
  secondary?: string;
  content: JSX.Element;
}
const SubMenuItem: React.FC<SubMenuItemProps> = ({
  disabled,
  secondary,
  content,
  children,
}) => {
  return (
    <li
      className={cls(
        styles["menu-item"],
        disabled && styles["menu-item--disabled"]
      )}
    >
      <AutoPopover placement="right-start" content={content}>
        <a className={styles["menu-item-content"]}>
          <span className={styles["menu-item-text"]}>{children}</span>
          {secondary && (
            <span className={styles["menu-item-secondary"]}>{secondary}</span>
          )}
          <svg className={styles["menu-item-icon"]} width={12} height={12}>
            <path d="M0,0 l6,6 l-6,6 z" fill="black" strokeWidth={0} />
          </svg>
        </a>
      </AutoPopover>
    </li>
  );
};

export default SubMenuItem;
