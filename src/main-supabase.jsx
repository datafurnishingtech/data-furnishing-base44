import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { SupabaseQueryProvider } from "@/lib/SupabaseQueryProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SupabaseQueryProvider>
    <App />
  </SupabaseQueryProvider>
);
