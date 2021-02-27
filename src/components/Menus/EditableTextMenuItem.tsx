import * as React from "react";

import EditableText, { EditableTextProps } from "../EditableText";

import { useMenuCloseContext } from "./MenuCloseContext";

import styles from "./Menus.module.css";

export type EditableTextMenuItemProps = EditableTextProps;
const EditableTextMenuItem: React.FC<EditableTextMenuItemProps> = (props) => {
  const { onRequestEdit, onCommit } = props;

  const requestMenuClose = useMenuCloseContext();

  const onClick = React.useCallback(() => {
    if (onRequestEdit) {
      onRequestEdit();
    }
  }, [onRequestEdit]);

  const onEditableCommit = React.useCallback(
    (value: string) => {
      onCommit(value);
      requestMenuClose();
    },
    [onCommit, requestMenuClose]
  );

  return (
    <li className={styles["menu-item"]} onClick={onClick}>
      <EditableText {...props} onCommit={onEditableCommit} />
    </li>
  );
};

export default EditableTextMenuItem;
