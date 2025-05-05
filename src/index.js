import React from "react"
import ReactDOM from 'react-dom/client';
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"

import { Provider } from "react-redux"

import store from "./store/index"

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/firebase-messaging-sw.js")
//     .then(reg => console.log("✅ Service Worker registered:", reg))
//     .catch(err => console.error("❌ Service Worker registration failed:", err));
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
);
serviceWorker.unregister()