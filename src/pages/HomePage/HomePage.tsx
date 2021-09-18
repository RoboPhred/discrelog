import * as React from "react";

import { cls } from "@/utils";
import { appVersion } from "@/env";

import flex from "@/styles/flex.module.css";

import { useAction } from "@/hooks/useAction";

import { hasAutosave } from "@/services/autosave/api";

import examples from "@/services/examples/examples";

import { restorePreviousProject } from "@/actions/project-restore-previous";
import { navigatePage } from "@/actions/page-navigate";

import { newProject } from "@/actions/project-new";
import { loadProject } from "@/actions/project-load";
import { loadExample } from "@/actions/example-load";

import Button from "@/components/Button";

import styles from "./HomePage.module.css";
import { useDispatch } from "react-redux";

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const onNavigateHome = useAction(navigatePage, "home");
  const onNewProject = useAction(newProject);
  const onLoadProject = useAction(loadProject);
  const onLoadPreviousProject = useAction(restorePreviousProject);

  React.useEffect(() => {
    onNavigateHome();
  }, [onNavigateHome]);

  const hasPreviousSave = hasAutosave();

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
          <div
            className={cls(
              styles.panel,
              styles["button-container"],
              flex["flexitem-grow"]
            )}
          >
            <Button onClick={onNewProject}>Start a new project</Button>
          </div>
          <div
            className={cls(
              styles.panel,
              styles["button-container"],
              flex["flexitem-grow"]
            )}
          >
            <Button onClick={onLoadProject}>Load an existing project</Button>
          </div>
          <div
            className={cls(
              styles.panel,
              styles["button-container"],
              flex["flexitem-grow"]
            )}
          >
            <Button disabled={!hasPreviousSave} onClick={onLoadPreviousProject}>
              Restore previous project
            </Button>
          </div>
        </div>
        <div className={styles.panel}>
          <h3>Examples</h3>
          <ul>
            <li>
              {Object.keys(examples).map((exampleKey) => (
                <a
                  href="#"
                  onClick={(e) => {
                    dispatch(loadExample(exampleKey));
                    e.preventDefault();
                  }}
                >
                  {examples[exampleKey].title}
                </a>
              ))}
            </li>
          </ul>
        </div>
        <div className={cls(styles.footer, styles.panel)}>{appVersion}</div>
      </div>
    </div>
  );
};

export default HomePage;
