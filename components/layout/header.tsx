"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Film, Search, User, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, signOut, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Don't show header on auth page
  if (pathname === "/auth") {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "professional-header soft-shadow-md"
          : "bg-background/85 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors soft-shadow">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <span className="hidden font-bold text-xl md:inline-block text-foreground">
                Cinema<span className="text-primary">Hub</span>
              </span>
            </Link>

            {user && (
              <nav className="ml-8 hidden md:flex items-center space-x-1">
                <Link
                  href="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/")
                      ? "bg-primary/5 text-primary"
                      : "professional-nav"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/top-rated"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/top-rated")
                      ? "bg-primary/5 text-primary"
                      : "professional-nav"
                  }`}
                >
                  Top Rated
                </Link>
                <Link
                  href="/upcoming"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/upcoming")
                      ? "bg-primary/5 text-primary"
                      : "professional-nav"
                  }`}
                >
                  Upcoming
                </Link>
              </nav>
            )}
          </div>

          {/* Desktop Search and Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="input-professional pr-10 w-[280px] lg:w-[320px] soft-shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </form>
            )}

            <ThemeToggle />

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="relative h-9 w-9 rounded-full bg-white text-primary hover:bg-primary/10 soft-shadow"
                        onClick={handleSignOut}
                        title="Log out"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 glass-effect soft-shadow-lg"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-foreground hover:bg-muted/50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/auth">
                    <Button className="btn-professional soft-shadow">
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden professional-header animate-fade-in soft-shadow-lg">
          <div className="container px-4 py-4 space-y-4">
            {user && (
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="input-professional pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            )}

            {user && (
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/")
                      ? "bg-primary/5 text-primary"
                      : "professional-nav"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/top-rated"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/top-rated")
                      ? "bg-primary/5 text-primary"
                      : "professional-nav"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Top Rated
                </Link>
                <Link
                  href="/upcoming"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/upcoming")
                      ? "bg-primary/5 text-primary"
                      : "professional-nav"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Upcoming
                </Link>
              </nav>
            )}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg soft-shadow">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage
                          src={
                            user.user_metadata?.avatar_url || "/placeholder.svg"
                          }
                          alt={user.email || ""}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="hover:bg-muted/50"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="btn-professional w-full soft-shadow">
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
