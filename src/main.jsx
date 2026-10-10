import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  StorefrontShell,
  StoreHero,
  StoreFeatures,
  StoreCatalog,
  StoreInspiration,
} from "./components/storefront";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <StorefrontShell>
              <StoreHero />
              <StoreFeatures />
              <StoreCatalog />
            </StorefrontShell>
          }
        />
        <Route
          path="/inspiration"
          element={
            <StorefrontShell>
              <StoreInspiration />
            </StorefrontShell>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
