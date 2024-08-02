"use client";

import { LoaderCircleIcon } from "lucide-react";
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
    <div className="w-full h-svh fixed bg-white z-[60] top-0 left-0 flex flex-col gap-2 items-center justify-center text-neutral-900">
      <LoaderCircleIcon className="w-5 h-5 animate-spin" />
      <b className="mt-2 text-center text-lg md:text-xl animate-bounce">
        Harap tunggu
      </b>
      <p className="text-center text-sm animate-bounce delay-75">
        Sedang menyiapkan data
      </p>
    </div>
  );
}
