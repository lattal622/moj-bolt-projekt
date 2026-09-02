"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Trophy, Chrome as Home, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Lige", icon: Home },
  { href: "/pretraga", label: "Pretraga", icon: Search },
  { href: "/predvidanja", label: "Predviđanja", icon: Trophy },
  { href: "/postavke", label: "Postavke", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:inline-block">
            Correct Score AI
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className={cn("gap-2", !active && "text-muted-foreground")}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
