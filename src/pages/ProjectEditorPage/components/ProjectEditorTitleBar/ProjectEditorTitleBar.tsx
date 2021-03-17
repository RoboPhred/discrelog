import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  projectModifiedSelector,
  projectNameSelector,
} from "@/services/project/selectors/project";

import TitleBar from "@/components/TitleBar";
import AutoPopover from "@/components/AutoPopover";
import Button from "@/components/Button";

import FileMenu from "../FileMenu";
import EditMenu from "../EditMenu";
import ViewMenu from "../ViewMenu";
import SimControls from "../SimControls";

import styles from "./ProjectEditorTitleBar.module.css";

export interface ProjectEditorTitleBarProps {
  className?: string;
}
const ProjectEditorTitleBar: React.FC<ProjectEditorTitleBarProps> = ({
  className,
}) => {
  const projectName = useSelector(projectNameSelector);
  const projectModified = useSelector(projectModifiedSelector);

  const title = `${projectName}${projectModified ? "*" : ""}`;

  return (
    <TitleBar className={className} title={title}>
      <AutoPopover content={<FileMenu />} placement="bottom-start">
        <Button variant="menu">File</Button>
      </AutoPopover>
      <AutoPopover content={<EditMenu />} placement="bottom-start">
        <Button variant="menu">Edit</Button>
      </AutoPopover>
      <AutoPopover content={<ViewMenu />} placement="bottom-start">
        <Button variant="menu">View</Button>
      </AutoPopover>
      <div className={styles["project-titlebar-controls"]}>
        <SimControls />
      </div>
    </TitleBar>
  );
};

export default ProjectEditorTitleBar;
