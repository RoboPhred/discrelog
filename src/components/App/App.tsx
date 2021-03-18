import * as React from "react";

import Routes from "@/router";

import DialogManager from "../DialogManager";
import Tutorial from "../Tutorial";

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <DialogManager />
      <Tutorial />
    </>
  );
};

export default App;
