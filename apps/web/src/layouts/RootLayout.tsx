import { Outlet } from "react-router-dom";
import { TopNavBar } from "@/components/nav/TopNavBar";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--sm-surface)] text-[var(--sm-on-surface)]">
      <TopNavBar />
      <Outlet />
    </div>
  );
}
