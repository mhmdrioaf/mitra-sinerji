"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function CardContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 items-center p-2 border rounded-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={twMerge("flex flex-col gap-1 items-center", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "w-full h-full grid grid-cols-2 gap-4 bg-white rounded-md p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
