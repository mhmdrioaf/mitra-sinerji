"use client";

import { SquareGanttChartIcon } from "lucide-react";

export default function SmallLoader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="animate-pulse">
        <SquareGanttChartIcon className="w-4 h-4 animate-bounce delay-0" />
      </div>
    </div>
  );
}
