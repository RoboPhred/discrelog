import * as React from "react";

import ReactMarkdown from "react-markdown";

import readmeContent from "@/../README.md";

import styles from "./Intro.module.css";

export interface IntroProps {
  dismiss(): void;
}
type Props = IntroProps;

const IntroPage: React.FC<Props> = ({ dismiss }) => {
  return (
    <div className={styles.intro}>
      <div className={styles["intro-content"]}>
        <div className={styles["intro-header"]}>
          <h3>
            <b>UNDER CONSTRUCTION</b>
            <p>
              This is an as-yet-unfinished experiment. The user interface is
              frustrating at best, and you cannot save your work. It is made
              available as a playground for the current state of the project.
            </p>
            <p>
              Scan through the readme below, and click the button at the bottom
              to enter
            </p>
            <p>
              The source can be found at{" "}
              <a href="https://github.com/RoboPhred/discrelog">
                https://github.com/RoboPhred/discrelog
              </a>
            </p>
          </h3>
        </div>
        <div className={styles["intro-markdown"]}>
          <ReactMarkdown source={readmeContent} />
        </div>
        <button className={styles["intro-dismiss"]} onClick={dismiss}>
          Let me break things
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
