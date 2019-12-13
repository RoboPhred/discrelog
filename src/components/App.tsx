import * as React from "react";
import { createUseStyles } from "react-jss";

import { isDev } from "@/env";

import CircuitEditor from "@/pages/CircuitEditor";
import Intro from "@/pages/Intro";

import TitleBar from "./TitleBar";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexFlow: "column nowrap",
    width: "100%",
    height: "100%"
  },
  content: {
    flex: "0 1 auto",
    minHeight: 0,
    width: "100%",
    height: "100%"
  }
});
const App: React.FC = () => {
  const styles = useStyles();

  const [introShown, setIntroShown] = React.useState(isDev);
  const onDismiss = React.useCallback(() => {
    setIntroShown(true);
  }, []);

  if (!introShown) {
    return <Intro dismiss={onDismiss} />;
  }

  return (
    <div className={styles.root}>
      <TitleBar />
      <CircuitEditor className={styles.content} />
    </div>
  );
};

export default App;
