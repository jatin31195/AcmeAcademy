"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/acme-courses" },
  { name: "Acme Library", path: "/acme-academy-open-library" },
  { name: "PYQ", path: "/pyq" },
  { name: "Results", path: "/acme-academy-results" },
  {
    name: "Exam",
    dropdown: [
      { name: "Exam Pattern", path: "/exam-pattern" },
      { name: "Score Analyser", path: "/score-checker" },
      { name: "Rank Predictor", path: "/nimcet-rank-predictor" },
    ],
  },
  { name: "Contact", path: "/contact-acme-academy" },
];

const withLogo = ["Acme Library", "Score Analyser", "Rank Predictor"];

// Ported from client/src/components/layout/Navbar.jsx. `/home` in the
// original navItems is now `/` per the approved bare-"/"-is-real-home
// decision; every other path is unchanged.
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const studentDropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false);
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node))
        setShowAuthDropdown(false);
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(e.target as Node))
        setShowStudentDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout?.();
      setShowDropdown(false);
      setIsOpen(false);
      // Ported react-router's navigate(0) (full current-page reload after
      // logout) as a real browser reload — the closest Next.js equivalent
      // that preserves the exact same "hard refresh" behavior rather than
      // router.refresh()'s RSC-cache-only invalidation.
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isItemActive = (path: string) => pathname === path;
  const isDropdownActive = (dropdown: { path: string }[]) =>
    dropdown.some((c) => pathname?.startsWith(c.path));

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <Image src="/logo.png" alt="ACME Academy" width={842} height={711} className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 ${
                  scrolled
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-[#ffffff] via-[hsla(218,76%,90%,1.00)] to-[hsla(299,71%,73%)]"
                }`}
              >
                ACME Academy
              </h1>
              <p className="text-xs text-white/90 -mt-1">MCA Entrance Academy</p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} ref={studentDropdownRef} className="relative">
                  <button
                    onClick={() => setShowStudentDropdown((v) => !v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                      isDropdownActive(item.dropdown)
                        ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                        : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${showStudentDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showStudentDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-1.5 z-50">
                      {item.dropdown.map((child) => (
                        <Link
                          key={child.name}
                          href={child.path}
                          onClick={() => setShowStudentDropdown(false)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                            isItemActive(child.path)
                              ? "text-[#0072CE] bg-blue-50 font-medium"
                              : "text-gray-700 hover:bg-blue-50 hover:text-[#0072CE]"
                          }`}
                        >
                          {withLogo.includes(child.name) && (
                            <Image src="/logo.png" alt="ACME" width={842} height={711} className="h-4 w-auto object-contain" />
                          )}
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                    isItemActive(item.path)
                      ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                      : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                  }`}
                >
                  {withLogo.includes(item.name) && (
                    <Image src="/logo.png" alt="ACME" width={842} height={711} className="h-4 w-auto object-contain" />
                  )}
                  <span>{item.name}</span>
                </Link>
              )
            )}
          </div>

          {/* AUTH SECTION */}
          <div className="hidden lg:flex items-center ml-2 shrink-0">
            {!isLoggedIn ? (
              /* ── Single "Account" button with Login/Signup dropdown ── */
              <div ref={authDropdownRef} className="relative">
                <button
                  onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md hover:opacity-90 transition-all"
                >
                  <UserCircle className="h-4 w-4" />
                  Account
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAuthDropdown ? "rotate-180" : ""}`} />
                </button>

                {showAuthDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-xl border border-gray-100 py-1.5 z-50">
                    <Link
                      href="/login"
                      onClick={() => setShowAuthDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE] transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setShowAuthDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE] transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged in user avatar dropdown ── */
              <div ref={dropdownRef} className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 focus:outline-none">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#0072CE] to-[#66CCFF] flex items-center justify-center text-white font-bold shadow-md text-sm">
                    {(user?.initials as string) ||
                      (user?.fullname as string)?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-44 bg-white shadow-xl rounded-xl border border-gray-100 py-1.5 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE]"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg rounded-lg mt-2 border shadow">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.name} className="pt-1">
                    <p className="px-4 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {item.name}
                    </p>
                    {item.dropdown.map((child) => (
                      <Link
                        key={child.name}
                        href={child.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          isItemActive(child.path)
                            ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                            : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                        }`}
                      >
                        {withLogo.includes(child.name) && (
                          <Image src="/logo.png" alt="ACME" width={842} height={711} className="h-4 w-auto object-contain" />
                        )}
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isItemActive(item.path)
                        ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                        : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                    }`}
                  >
                    {withLogo.includes(item.name) && (
                      <Image src="/logo.png" alt="ACME" width={842} height={711} className="h-4 w-auto object-contain" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                )
              )}

              <div className="border-t pt-2 space-y-1">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center text-sm font-medium bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block text-center text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE] rounded-lg py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center text-sm text-red-500 hover:bg-red-50 py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
