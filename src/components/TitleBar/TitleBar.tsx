import * as React from "react";

import { cls } from "@/utils";

import AutoPopover from "../AutoPopover";
import Button from "../Button";
import FileMenu from "../FileMenu";
import EditMenu from "../EditMenu";
import ViewMenu from "../ViewMenu";
import SimControls from "../SimControls";

import styles from "./TitleBar.module.css";

export interface TitleBarProps {
  className?: string;
}
const TitleBar: React.FC<TitleBarProps> = ({ className }) => {
  return (
    <div className={cls(styles.titlebar, className)}>
      <span className={styles["titlebar-heading"]}>Discrelog</span>
      <div className={styles["titlebar-divider"]} />
      <AutoPopover content={<FileMenu />} placement="bottom-start">
        <Button>File</Button>
      </AutoPopover>
      <AutoPopover content={<EditMenu />} placement="bottom-start">
        <Button>Edit</Button>
      </AutoPopover>
      <AutoPopover content={<ViewMenu />} placement="bottom-start">
        <Button>View</Button>
      </AutoPopover>

      <div className={styles["titlebar-controls"]}>
        <SimControls />
      </div>
    </div>
  );
};

export default TitleBar;
