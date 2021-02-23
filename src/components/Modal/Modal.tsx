import { cls } from "@/utils";
import * as React from "react";
import { createPortal } from "react-dom";
import { FocusOn, AutoFocusInside } from "react-focus-on";

import sizing from "@/styles/sizing.module.css";

import styles from "./Modal.module.css";

export interface ModalProps {
  className?: string;
  isOpen: boolean;
  onRequestClose?(): void;
}

const Modal: React.FC<ModalProps> = ({
  className,
  isOpen,
  onRequestClose,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={cls("modal", styles["modal"])}>
      <FocusOn onClickOutside={onRequestClose} onEscapeKey={onRequestClose}>
        <div className={cls(styles["modal-content"], className)}>
          <AutoFocusInside className={sizing["fill-parent"]}>
            {children}
          </AutoFocusInside>
        </div>
      </FocusOn>
    </div>,
    document.body
  );
};

export default Modal;
