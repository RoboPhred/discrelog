import * as React from "react";

import { cls } from "@/utils";

import flex from "@/styles/flex.module.css";
import sizing from "@/styles/sizing.module.css";

import CircuitEditor from "@/pages/CircuitEditor";

import TitleBar from "../TitleBar";
import DialogManager from "../DialogManager";

const App: React.FC = () => {
  return (
    <div className={cls(sizing["fill-parent"], flex["flex-column"])}>
      <DialogManager />
      <TitleBar />
      <CircuitEditor
        className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}
      />
    </div>
  );
};

export default App;
