import * as React from "react";

import Popper, { PopperPlacement } from "../Popper";

import styles from "./PopupMenu.module.css";

export interface PopupMenuProps {
  isOpen: boolean;
  placement: PopperPlacement;
  anchorEl: Element | null;
}

const PopupMenu: React.FC<PopupMenuProps> = ({
  isOpen,
  placement,
  anchorEl,
  children
}) => {
  return (
    <Popper
      className={styles.popupmenu}
      isOpen={isOpen}
      placement={placement}
      anchorEl={anchorEl}
    >
      {children}
    </Popper>
  );
};

export default PopupMenu;
