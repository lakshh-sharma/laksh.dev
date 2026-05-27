import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OSProvider } from "./os/store";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OSProvider>
      <App />
    </OSProvider>
  </React.StrictMode>
);
