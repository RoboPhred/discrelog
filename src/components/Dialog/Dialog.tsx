import * as React from "react";

import Button from "@/components/Button";
import Modal from "@/components/Modal";

import styles from "./Dialog.module.css";

export interface DialogProps {
  isOpen: boolean;
  acceptText?: string;
  cancelText?: string;
  footer?: React.ReactNode;
  onAccept?(): void;
  onCancel?(): void;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  acceptText,
  cancelText,
  onAccept,
  onCancel,
  footer,
  children,
}) => {
  return (
    <Modal
      className={styles["dialog"]}
      isOpen={isOpen}
      onRequestClose={onCancel}
    >
      <div>{children}</div>
      <div className={styles["dialog-footer"]}>
        {footer}
        {onCancel && (
          <Button onClick={onCancel}>{cancelText ?? "Cancel"}</Button>
        )}
        {onAccept && (
          <Button onClick={onAccept}>{acceptText ?? "Accept"}</Button>
        )}
      </div>
    </Modal>
  );
};

export default Dialog;
