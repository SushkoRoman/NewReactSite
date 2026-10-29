import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./global.css";

import {
  StorefrontShell,
  StoreHero,
  StoreFeatures,
  StoreCatalog,
  StoreInspiration,
} from "./components/storefront";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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
        <Route
          path="/catalog"
          element={
            <StorefrontShell>
              <StoreCatalog />
            </StorefrontShell>
          }
        />
        
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);