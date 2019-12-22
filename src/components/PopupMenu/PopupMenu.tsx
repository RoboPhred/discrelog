import * as React from "react";
import { FocusOn } from "react-focus-on";

import Popper, { PopperPlacement } from "../Popper";

import styles from "./PopupMenu.module.css";

export interface PopupMenuProps {
  isOpen: boolean;
  placement: PopperPlacement;
  anchorEl: Element | null;
  onClose(): void;
}

const PopupMenu: React.FC<PopupMenuProps> = ({
  isOpen,
  placement,
  anchorEl,
  onClose,
  children
}) => {
  return (
    <Popper
      className={styles.popupmenu}
      isOpen={isOpen}
      placement={placement}
      anchorEl={anchorEl}
    >
      <FocusOn enabled={isOpen} onClickOutside={onClose} onEscapeKey={onClose}>
        {children}
      </FocusOn>
    </Popper>
  );
};

export default PopupMenu;
