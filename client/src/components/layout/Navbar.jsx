import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();


  const isLoggedIn = true; 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/acme-courses" },
    { name: "Acme Library", path: "/acme-academy-open-library" },
    { name: "PYQ", path: "/pyq" },
    { name: "Exam Pattern", path: "/exam-pattern" },
    { name: "Results", path: "/acme-academy-results" },
    { name: "Contact", path: "/contact-acme-academy" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3">
            <img src={logo} alt="ACME Academy" className="h-10 w-auto" />
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
              <p className="text-xs text-white/90 -mt-1">
                MCA Entrance Academy
              </p>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          {/* Desktop Nav */}
<div className="hidden lg:flex items-center space-x-2">
  {navItems.map((item) => (
    <NavLink
      key={item.name}
      to={item.path}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
          isActive
            ? "bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md"
            : "text-gray-700 hover:text-[#0072CE] hover:bg-blue-50"
        }`
      }
    >
      {/* Add logo only for Acme Library */}
      {item.name === "Acme Library" && (
        <img src={logo} alt="ACME" className="h-4 w-auto object-contain" />
      )}
      <span>{item.name}</span>
    </NavLink>
  ))}
</div>


          {/* Auth or Dashboard Button */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="block px-4 py-2 text-center text-sm font-medium text-white rounded-lg bg-gradient-to-r from-[#0072CE] to-[#66CCFF] shadow-md hover:opacity-90 hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-300"
                >
                  Join Now
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/dashboard"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md hover:opacity-90 hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-300"
                title="Dashboard"
              >
                ⚙️
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg rounded-lg mt-2 border shadow">
              {navItems.map((item) => (
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
    {item.name === "Acme Library" && (
      <img src={logo} alt="ACME" className="h-4 w-auto object-contain" />
    )}
    <span>{item.name}</span>
  </NavLink>
))}


              <div className="border-t pt-2 space-y-2">
                {!isLoggedIn ? (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center text-sm font-medium bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white hover:opacity-90 rounded-lg"
                    >
                      Join Now
                    </NavLink>
                  </>
                ) : (
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-[#0072CE] to-[#66CCFF] text-white shadow-md hover:opacity-90 hover:shadow-lg transition-all duration-300"
                    title="Dashboard"
                  >
                    ⚙️
                  </NavLink>
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
