import * as React from "react";

import MenuItem from "../MenuItem";

import styles from "./TitleBar.module.css";

const TitleBar: React.FC = () => {
  return (
    <div className={styles.titlebar}>
      <span className={styles["titlebar-brand"]}>Discrelog</span>
      <MenuItem title="File" childPlacement="bottom-start">
        <MenuItem title="Foo" />
        <MenuItem title="Bar" />
      </MenuItem>
    </div>
  );
};

export default TitleBar;
