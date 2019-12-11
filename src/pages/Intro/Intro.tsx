import * as React from "react";
import { createUseStyles } from "react-jss";


import ReactMarkdown from "react-markdown";

import readmeContent from "@/../README.md";

export interface IntroProps {
  dismiss(): void;
}
type Props = IntroProps;


const useStyles = createUseStyles({
  root: {
    boxSizing: "border-box",
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    padding: "25px",
    zIndex: 9999
  },
  content: {
    boxSizing: "border-box",
    border: "1px solid #888",
    width: "100%",
    height: "100%",
    padding: "5px",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    flex: "0 1 auto"
  },
  markdown: {
    flex: "0 1 auto",
    overflowY: "scroll",
    background: "lightgray",
    margin: "5px",
    padding: "5px"
  },
  dismiss: {
    minHeight: "2em"
  }
});


const IntroPage: React.FC<Props> = ({ dismiss }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>
            <b>UNDER CONSTRUCTION</b>
            <p>
              This is an as-yet-unfinished experiment. The user interface is
              frustrating at best, and you cannot save your work. It is made
              available as a playground for the current state of the project.
              </p>
            <p>
              Scan through the readme below, and click the button at the
              bottom to enter
              </p>
            <p>
              The source can be found at{" "}
              <a href="https://github.com/RoboPhred/discrelog">
                https://github.com/RoboPhred/discrelog
                </a>
            </p>
          </h3>
        </div>
        <div className={styles.markdown}>
          <ReactMarkdown source={readmeContent} />
        </div>
        <button className={styles.dismiss} onClick={dismiss}>Let me break things</button>
      </div>
    </div>
  );
}

export default IntroPage;
