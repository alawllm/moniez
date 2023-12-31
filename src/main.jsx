import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { RecordsProvider } from "./contexts/records.context.jsx";
import { SpacesProvider } from "./contexts/spaces.context.jsx";
import { UserProvider } from "./contexts/user.context.jsx";
import App from "./App.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SpacesProvider>
          <RecordsProvider>
            <App />
          </RecordsProvider>
        </SpacesProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
