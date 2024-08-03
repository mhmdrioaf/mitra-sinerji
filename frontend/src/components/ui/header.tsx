"use client";

import { MenuIcon, SquareChartGanttIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

export default function Header() {
  const pathname = usePathname();
  const isActive = (currentPath: string) => pathname === currentPath;

  return (
    <header className="w-full px-4 md:px-8 py-2 sticky top-0 left-0 justify-between inline-flex items-center bg-background/70 backdrop-blur-md border-b border-b-input z-50">
      <Link href="/" className="inline-flex items-center gap-2 text-primary">
        <SquareChartGanttIcon className="w-6 h-6" />
        <p className="text-lg font-bold">Klyvo.</p>
      </Link>

      <nav>
        <div className="md:hidden">
          <Drawer>
            <Button size="icon" variant="outline" asChild>
              <DrawerTrigger>
                <MenuIcon className="w-4 h-4" />
              </DrawerTrigger>
            </Button>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>Navigasi Fitur</DrawerDescription>
              </DrawerHeader>
              <div className="w-full flex flex-col gap-2 px-4 pb-2">
                <Button asChild variant={isActive("/") ? "default" : "ghost"}>
                  <Link href="/">Dashboard</Link>
                </Button>
                <Button
                  asChild
                  variant={isActive("/sales") ? "default" : "ghost"}
                >
                  <Link href="/sales">Data Transaksi</Link>
                </Button>
                <Button
                  asChild
                  variant={isActive("/barang") ? "default" : "ghost"}
                >
                  <Link href="/barang">Data Barang</Link>
                </Button>
                <Button
                  asChild
                  variant={isActive("/customer") ? "default" : "ghost"}
                >
                  <Link href="/customer">Data Customer</Link>
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="hidden md:inline-flex gap-4">
          <Button asChild variant={isActive("/") ? "default" : "link"}>
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant={isActive("/sales") ? "default" : "link"}>
            <Link href="/sales">Data Transaksi</Link>
          </Button>
          <Button asChild variant={isActive("/barang") ? "default" : "link"}>
            <Link href="/barang">Data Barang</Link>
          </Button>
          <Button asChild variant={isActive("/customer") ? "default" : "link"}>
            <Link href="/customer">Data Customer</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
