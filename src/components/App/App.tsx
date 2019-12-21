import * as React from "react";

import { isDev } from "@/env";

import flex from "@/styles/flex.module.css";
import sizing from "@/styles/sizing.module.css";

import CircuitEditor from "@/pages/CircuitEditor";
import Intro from "@/pages/Intro";

import TitleBar from "../TitleBar";
import { cls } from "@/utils";

const App: React.FC = () => {
  const [introShown, setIntroShown] = React.useState(isDev);
  const onDismiss = React.useCallback(() => {
    setIntroShown(true);
  }, []);

  if (!introShown) {
    return <Intro dismiss={onDismiss} />;
  }

  return (
    <div className={cls(sizing["fill-parent"], flex["flex-column"])}>
      <TitleBar />
      <CircuitEditor
        className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}
      />
    </div>
  );
};

export default App;
