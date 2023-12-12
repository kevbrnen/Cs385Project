import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

//Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
//Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
