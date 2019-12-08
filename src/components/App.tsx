import * as React from "react";

import { isDev } from "@/env";

import CircuitEditor from "@/pages/CircuitEditor";
import Intro from "@/pages/Intro";

const App: React.FC = () => {
  const [introShown, setIntroShown] = React.useState(isDev);
  const onDismiss = React.useCallback(() => {
    setIntroShown(true);
  }, []);

  if (!introShown) {
    return <Intro dismiss={onDismiss} />
  }

  return <CircuitEditor />
}

export default App;