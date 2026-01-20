import React from "react";
import ReactDom from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./utils/i18n.jsx";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./components/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
