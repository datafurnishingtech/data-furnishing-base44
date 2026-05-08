import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import IdleSessionWarning from "@/components/auth/IdleSessionWarning";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[210px]">
        <TopBar />
        <main className="p-5">
          <Outlet />
        </main>
        <IdleSessionWarning />
      </div>
    </div>
  );
}