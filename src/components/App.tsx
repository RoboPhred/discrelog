import * as React from "react";

import { isDev } from "@/env";

import CircuitEditor from "@/pages/CircuitEditor";
import Intro from "@/pages/Intro";

type Props = {};
interface State {
  introShown: boolean;
}
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      introShown: isDev
    };

    this._onIntroDismiss = this._onIntroDismiss.bind(this);
  }

  render() {
    if (!this.state.introShown) {
      return <Intro dismiss={this._onIntroDismiss} />;
    }
    return <CircuitEditor />;
  }

  private _onIntroDismiss() {
    this.setState({
      introShown: true
    });
  }
}

export default App;
