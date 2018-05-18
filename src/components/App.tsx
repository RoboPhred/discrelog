import * as React from "react";

import { hot } from "react-hot-loader";

import CircuitEditor from "@/pages/CircuitEditor";

class App extends React.Component {
  render() {
    return <CircuitEditor />;
  }
}

export default hot(module)(App);
