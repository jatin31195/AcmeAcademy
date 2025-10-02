import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "/logo.png";

// If you don’t have shadcn/ui, replace Button & Dropdown with normal HTML
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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
    { name: "Exams", path: "/exams" },
    { name: "Open Library", path: "/library" },
    { name: "PYQ", path: "/pyq" },
    { name: "Exam Pattern", path: "/exam-pattern" },
    { name: "Results", path: "/results" },
    { name: "Contact", path: "/contact" },
  ];

  const examItems = [
    { name: "NIMCET", path: "/exams/nimcet" },
    { name: "CUET-PG MCA", path: "/exams/cuet-pg" },
    { name: "MAH-CET MCA", path: "/exams/mah-cet" },
    { name: "JMI MCA", path: "/exams/jmi" },
    { name: "BIT MCA", path: "/exams/bit" },
    { name: "VIT MCA", path: "/exams/vit" },
    { name: "DU MCA", path: "/exams/du" },
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
          :"bg-gradient-to-r from-[#ffffff] via-[hsla(218, 76%, 90%, 1.00)] to-[hsla(299,71%,73%)]" 
      }`}
    >
      ACME Academy
    </h1>

              <p className="text-xs text-white-500 -mt-1">MCA Entrance Academy</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Exams Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center">
                Exams <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute hidden group-hover:block mt-2 bg-white shadow-lg rounded-lg w-48 border">
                {examItems.map((exam) => (
                  <NavLink
                    key={exam.name}
                    to={exam.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {exam.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {navItems.slice(4).map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium rounded hover:bg-emerald-600"
            >
              Join Now
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg rounded-lg mt-2 border shadow">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <div className="border-t pt-2">
                <p className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                  Exams
                </p>
                {examItems.map((exam) => (
                  <NavLink
                    key={exam.name}
                    to={exam.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {exam.name}
                  </NavLink>
                ))}
              </div>

              <div className="border-t pt-2 space-y-2">
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
                  className="block px-4 py-2 text-center text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"
                >
                  Join Now
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
