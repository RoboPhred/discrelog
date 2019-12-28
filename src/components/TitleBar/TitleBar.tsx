import * as React from "react";

import { useAction } from "@/hooks/useAction";
import { newFile } from "@/actions/file-new";

import MenuItem from "../MenuItem";

import styles from "./TitleBar.module.css";

const TitleBar: React.FC = () => {
  const onFileNew = useAction(newFile);

  return (
    <div className={styles.titlebar}>
      <span className={styles["titlebar-brand"]}>Discrelog</span>
      <MenuItem title="File" childPlacement="bottom-start">
        <MenuItem title="New" onClick={onFileNew} />
      </MenuItem>
    </div>
  );
};

export default TitleBar;
