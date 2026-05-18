import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLarge = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isLarge) setSidebarOpen(false);
  }, [isLarge]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-50 lg:z-auto h-full transition-colors duration-150`}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="pt-3 px-3">
          <TopBar onOpenSidebar={() => setSidebarOpen(true)} />
        </div>
        <main className="flex-1 overflow-auto p-3 pt-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}