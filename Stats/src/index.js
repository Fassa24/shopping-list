import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShoppingListsOverview from "./components/ShoppingListsOverview";
import ShoppingListDetail from "./components/ShoppingListDetail";
import "./i18n";
import "./index.css";


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ShoppingListsOverview />} />
      <Route path="/list/:id" element={<ShoppingListDetail />} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);