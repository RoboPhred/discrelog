import * as React from "react";

import { cls } from "@/utils";

import flex from "@/styles/flex.module.css";
import sizing from "@/styles/sizing.module.css";

import Routes from "@/router";

import TitleBar from "../TitleBar";
import DialogManager from "../DialogManager";

const App: React.FC = () => {
  return (
    <div className={cls(sizing["fill-parent"], flex["flex-column"])}>
      <TitleBar className={flex["flexitem-fix"]} />
      <div className={cls(sizing["fill-parent"], flex["flexitem-shrink"])}>
        <Routes />
      </div>
      <DialogManager />
    </div>
  );
};

export default App;
