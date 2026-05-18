import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { MobileNavProvider } from "./MobileNavContext";

export default function AppLayout() {
  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Sidebar />
        <div className="lg:ml-[210px] ml-0 p-3 min-w-0">
          <div className="min-w-0">
            <TopBar />
            <main className="p-4 lg:p-6 bg-background min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </MobileNavProvider>
  );
}
