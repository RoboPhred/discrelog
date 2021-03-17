import * as React from "react";

import { useNativeEvent } from "@/hooks/useNativeEvent";
import { useAction } from "@/hooks/useAction";

import Routes from "@/router";

import { circuitEditorDragAbort } from "@/actions/circuit-editor-drag-abort";

import DialogManager from "../DialogManager";

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <DialogManager />
    </>
  );
};

export default App;
