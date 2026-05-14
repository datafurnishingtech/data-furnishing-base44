import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import IdleSessionWarning from "@/components/auth/IdleSessionWarning";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[210px] p-3">
        <div className="rounded-xl overflow-hidden">
          <TopBar />
          <main className="p-6 bg-background">
            <Outlet />
          </main>
        </div>
        {/* <IdleSessionWarning /> */}
      </div>
    </div>
  );
}