"use client";
import { useDashboard } from "@/components/admin/DashboardContext";
import { Setting2 } from "iconsax-react";

export default function DashboardPage() {
  const context = useDashboard();
  return (
    <>
      <div className="h-12 flex justify-end">
        <Setting2 />
      </div>
      <h1 className="font-bold text-xl text-darkBlue">Dashboard</h1>
      <div className="w-full text-center py-16 text-3xl">
        {context.numBooks} uploaded books.
      </div>
    </>
  );
}
