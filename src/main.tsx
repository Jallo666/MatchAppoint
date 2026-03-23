import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home"; // <- importa il componente
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <Home /> {/* <-- JSX qui, valore, non tipo */}
  </React.StrictMode>
);