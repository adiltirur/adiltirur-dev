"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 flex h-[57px] sm:h-[73px] items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
          adiltirur.dev
        </Link>
        <nav className="flex items-center gap-1">
          <button
            onClick={() => scrollTo("about")}
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
          >
            about
          </button>
          <button
            onClick={() => scrollTo("experience")}
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
          >
            experience
          </button>
          <button
            onClick={() => scrollTo("oss")}
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
          >
            open source
          </button>
          <Link
            href="/tools"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
          >
            tools
          </Link>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-1 h-9 w-9 sm:ml-2 sm:h-8 sm:w-8"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden ml-1 h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="max-w-[680px] mx-auto px-4 py-3 flex flex-col gap-1">
            <button
              onClick={() => scrollTo("about")}
              className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-3 rounded-md hover:bg-accent min-h-[44px] flex items-center"
            >
              about
            </button>
            <button
              onClick={() => scrollTo("experience")}
              className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-3 rounded-md hover:bg-accent min-h-[44px] flex items-center"
            >
              experience
            </button>
            <button
              onClick={() => scrollTo("oss")}
              className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-3 rounded-md hover:bg-accent min-h-[44px] flex items-center"
            >
              open source
            </button>
            <Link
              href="/tools"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-3 rounded-md hover:bg-accent min-h-[44px] flex items-center"
            >
              tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
