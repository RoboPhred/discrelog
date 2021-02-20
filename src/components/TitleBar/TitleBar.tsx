import * as React from "react";

import AutoPopover from "../AutoPopover";
import Button from "../Button";
import FileMenu from "../FileMenu";
import EditMenu from "../EditMenu";
import SimControls from "../SimControls";

import styles from "./TitleBar.module.css";

const TitleBar: React.FC = () => {
  return (
    <div className={styles.titlebar}>
      <span className={styles["titlebar-heading"]}>Discrelog</span>
      <div className={styles["titlebar-divider"]} />
      <AutoPopover content={<FileMenu />} placement="bottom-start">
        <Button>File</Button>
      </AutoPopover>
      <AutoPopover content={<EditMenu />} placement="bottom-start">
        <Button>Edit</Button>
      </AutoPopover>

      <div className={styles["titlebar-controls"]}>
        <SimControls />
      </div>
    </div>
  );
};

export default TitleBar;
