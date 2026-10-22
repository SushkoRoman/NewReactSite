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
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sign-in" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
