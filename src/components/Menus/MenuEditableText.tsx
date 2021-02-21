import * as React from "react";

import EditableText, { EditableTextProps } from "../EditableText";

import styles from "./Menus.module.css";

export type MenuEditableTextProps = EditableTextProps;
const MenuEditableText: React.FC<MenuEditableTextProps> = (props) => {
  const { onRequestEdit } = props;
  const onClick = React.useCallback(() => {
    if (onRequestEdit) {
      onRequestEdit();
    }
  }, [onRequestEdit]);

  return (
    <li className={styles["menu-item"]} onClick={onClick}>
      <EditableText {...props} />
    </li>
  );
};

export default MenuEditableText;
