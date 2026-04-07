import { Outlet } from "react-router-dom";
import { SideNavBar } from "@/components/nav/SideNavBar";
import { BottomNavBar } from "@/components/nav/BottomNavBar";

export function DashboardLayout() {
  return (
    <div className="flex h-[calc(100vh-49px)] overflow-hidden">
      <SideNavBar />
      <main className="flex-1 overflow-auto custom-scrollbar pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  );
}
