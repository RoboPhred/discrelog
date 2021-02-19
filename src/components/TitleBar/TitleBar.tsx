import * as React from "react";

import { Button, Popover } from "@blueprintjs/core";

import EditMenu from "../EditMenu";
import FileMenu from "../FileMenu";
import SimControls from "../SimControls";

import styles from "./TitleBar.module.css";

const TitleBar: React.FC = () => {
  return (
    <div className={styles.titlebar}>
      <span className={styles["titlebar-heading"]}>Discrelog</span>
      <div className={styles["titlebar-divider"]} />
      <Popover content={<FileMenu />}>
        <Button minimal icon="document" text="File" />
      </Popover>
      <Popover content={<EditMenu />}>
        <Button minimal icon="edit" text="Edit" />
      </Popover>

      <div className={styles["titlebar-controls"]}>
        <SimControls />
      </div>
    </div>
  );
};

export default TitleBar;
