"use client";

import { SquareChartGantt } from "lucide-react";
import React from "react";

export default function Loading() {
  React.useEffect(() => {
    const body = document.querySelector("body");
    body?.classList.add("overflow-hidden");
    return () => {
      body?.classList.remove("overflow-hidden");
    };
  });

  return (
    <div className="w-full h-svh fixed bg-background z-[60] top-0 left-0 grid place-items-center">
      <div className="flex flex-col gap-2 items-center justify-center text-primary animate-pulse">
        <SquareChartGantt className="w-6 h-6 animate-bounce delay-0" />
        <p className="font-medium animate-bounce delay-100">Klyvo.</p>
      </div>
    </div>
  );
}
