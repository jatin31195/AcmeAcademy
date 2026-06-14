import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, UserCircle } from "lucide-react";
import logo from "/logo.png";
import { useAuth } from "@/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const authDropdownRef = useRef(null);
  const studentDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target))
        setShowAuthDropdown(false);
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(e.target))
        setShowStudentDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      setIsOpen(false);
      navigate(0);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { name: "Home",           path: "/home" },
    { name: "About",          path: "/about" },
    { name: "Courses",        path: "/acme-courses" },
    { name: "Acme Library",   path: "/acme-academy-open-library" },
    { name: "PYQ",            path: "/pyq" },
    { name: "Results",        path: "/acme-academy-results" },
    {
      name: "Exam",
      dropdown: [
        { name: "Exam Pattern",   path: "/exam-pattern" },
        { name: "Score Analyser", path: "/score-checker" }]
    },
    { name: "Contact",        path: "/contact-acme-academy" },
  ];

  const withLogo = ["Acme Library", "Score Analyser", "Rank Predictor"];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center space-x-3 shrink-0">
            <img src={logo} alt="ACME Academy" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold text-transparent bg-clip-text drop-shadow-md transition-all duration-500 ${
                scrolled
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-[#ffffff] via-[hsla(218,76%,90%,1.00)] to-[hsla(299,71%,73%)]"
              }`}>
                ACME Academy
              </h1>
              <p className="text-xs text-white/90 -mt-1">MCA Entrance Academy</p>
            </div>
          </NavLink>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} ref={studentDropdownRef} className="relative">
                  <button
                    onClick={() => setShowStudentDropdown((v) => !v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                      item.dropdown.some((c) => location.pathname.startsWith(c.path))
                        ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                        : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showStudentDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showStudentDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-1.5 z-50">
                      {item.dropdown.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          onClick={() => setShowStudentDropdown(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? "text-[#0072CE] bg-blue-50 font-medium"
                                : "text-gray-700 hover:bg-blue-50 hover:text-[#0072CE]"
                            }`
                          }
                        >
                          {withLogo.includes(child.name) && (
                            <img src={logo} alt="ACME" className="h-4 w-auto object-contain" />
                          )}
                          <span>{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                        : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                    }`
                  }
                >
                  {withLogo.includes(item.name) && (
                    <img src={logo} alt="ACME" className="h-4 w-auto object-contain" />
                  )}
                  <span>{item.name}</span>
                </NavLink>
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
                    <NavLink
                      to="/login"
                      onClick={() => setShowAuthDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE] transition-colors"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setShowAuthDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE] transition-colors"
                    >
                      Sign Up
                    </NavLink>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged in user avatar dropdown ── */
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#0072CE] to-[#66CCFF] flex items-center justify-center text-white font-bold shadow-md text-sm">
                    {user?.initials || user?.fullname?.[0]?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-44 bg-white shadow-xl rounded-xl border border-gray-100 py-1.5 z-50">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE]"
                    >
                      Dashboard
                    </NavLink>
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
                      <NavLink
                        key={child.name}
                        to={child.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            isActive
                              ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                              : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                          }`
                        }
                      >
                        {withLogo.includes(child.name) && (
                          <img src={logo} alt="ACME" className="h-4 w-auto object-contain" />
                        )}
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
                          : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
                      }`
                    }
                  >
                    {withLogo.includes(item.name) && (
                      <img src={logo} alt="ACME" className="h-4 w-auto object-contain" />
                    )}
                    <span>{item.name}</span>
                  </NavLink>
                )
              )}

              <div className="border-t pt-2 space-y-1">
                {!isLoggedIn ? (
                  <>
                    <NavLink to="/login" onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Login
                    </NavLink>
                    <NavLink to="/signup" onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center text-sm font-medium bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white rounded-lg">
                      Sign Up
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/dashboard" onClick={() => setIsOpen(false)}
                      className="block text-center text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0072CE] rounded-lg py-2">
                      Dashboard
                    </NavLink>
                    <button onClick={handleLogout}
                      className="block w-full text-center text-sm text-red-500 hover:bg-red-50 py-2 rounded-lg">
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