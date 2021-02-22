import * as React from "react";
import * as ReactDOM from "react-dom";
import "resize-observer-polyfill";

import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import history from "./history";
import "./styles";

import { store } from "./store";

import App from "./components/App";

const rootEl = document.getElementById("root");

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  rootEl
);
