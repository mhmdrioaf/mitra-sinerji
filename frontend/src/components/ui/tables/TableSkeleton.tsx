"use client";

import { TableCell, TableRow } from "../table";

interface ITableSkeletonProps {
  rows: number;
}

export default function TableSkeleton({ rows }: ITableSkeletonProps) {
  return (
    <TableRow className="border">
      {Array.from({ length: rows }, (_, i) => (
        <TableCell key={i} className={i !== rows ? "border-r" : ""}>
          <div className="animate-pulse h-4 w-full bg-neutral-300 rounded-md"></div>
        </TableCell>
      ))}
    </TableRow>
  );
}
