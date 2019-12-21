import * as React from "react";

import { isDev } from "@/env";

import CircuitEditor from "@/pages/CircuitEditor";
import Intro from "@/pages/Intro";

import TitleBar from "../TitleBar";

import styles from "./App.module.css";

const App: React.FC = () => {
  const [introShown, setIntroShown] = React.useState(isDev);
  const onDismiss = React.useCallback(() => {
    setIntroShown(true);
  }, []);

  if (!introShown) {
    return <Intro dismiss={onDismiss} />;
  }

  return (
    <div className={styles["app-root"]}>
      <TitleBar />
      <CircuitEditor className={styles["app-content"]} />
    </div>
  );
};

export default App;
