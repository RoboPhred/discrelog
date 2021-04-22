import * as React from "react";

import { cls } from "@/utils";
import { appVersion } from "@/env";

import flex from "@/styles/flex.module.css";

import { useAction } from "@/hooks/useAction";

import Button from "@/components/Button";

import { newProject } from "@/actions/project-new";
import { loadProject } from "@/actions/project-load";

import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const onNewProject = useAction(newProject);
  const onLoadProject = useAction(loadProject);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.panel}>
          <h1>Discrelog</h1>
          <h3>
            Discrelog is a discrete logic simulator for exploring TTL logic
            systems.
          </h3>
        </div>
        <div className={cls(flex["flex-row"], flex["flex-space-around"])}>
          <div className={cls(styles.panel, flex["flexitem-grow"])}>
            <Button onClick={onNewProject}>Start a new project</Button>
          </div>
          <div className={cls(styles.panel, flex["flexitem-grow"])}>
            <Button onClick={onLoadProject}>Load an existing project</Button>
          </div>
          {/* <div className={cls(styles.panel, flex["flexitem-grow"])}>
            <Button>Restore previous project</Button>
          </div> */}
        </div>
        <div className={styles.footer}>{appVersion}</div>
      </div>
    </div>
  );
};

export default HomePage;
