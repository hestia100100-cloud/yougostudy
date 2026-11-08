"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimalAvatar } from "@/components/profile/AnimalAvatar";
import { currentUser } from "@/lib/mock-data";

const NAV = [
  { href: "/lobby", label: "Lobby" },
  { href: "/rooms/public", label: "Public Rooms" },
  { href: "/rooms/private", label: "Private Rooms" },
  { href: "/rooms/mine", label: "My Rooms" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b-2 border-bark bg-forest text-paper md:h-screen md:w-56 md:border-b-0 md:border-r-2">
      <div className="px-5 py-4 md:py-6">
        <Link href="/lobby" className="text-xl font-bold tracking-tight">
          yougostudy
        </Link>
        <p className="mt-1 hidden text-xs text-beige md:block">A little space to focus together.</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                active ? "bg-paper font-semibold text-forest" : "hover:bg-olive"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/profile"
        className="mt-auto hidden items-center gap-3 border-t border-olive px-5 py-4 hover:bg-olive md:flex"
      >
        <AnimalAvatar animal={currentUser.animal} size="sm" />
        <div className="text-sm">
          <div className="font-semibold">{currentUser.username}</div>
          <div className="text-xs text-beige">● online</div>
        </div>
      </Link>
    </aside>
  );
}
