import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import IdleSessionWarning from "@/components/auth/IdleSessionWarning";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-[210px] p-3 min-h-screen">
        <div className="bg-card rounded-xl min-h-full flex flex-col">
          <TopBar />
          <main className="p-5 flex-1">
            <Outlet />
          </main>
          <IdleSessionWarning />
        </div>
      </div>
    </div>
  );
}