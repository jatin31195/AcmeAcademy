import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "/logo.png";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Exams", path: "/exams" },
    { name: "Open Library", path: "/library" },
    { name: "PYQ", path: "/pyq" },
    { name: "Exam Pattern", path: "/exam-pattern" },
    { name: "Results", path: "/results" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <NavLink to="/" className="logo">
          <img src={logo} alt="ACME Academy" />
          <span>ACME Academy</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="nav-item"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {/* Auth Buttons */}
          <div className="auth-buttons">
            <NavLink to="/login" className="btn">
              Login
            </NavLink>
            <NavLink to="/signup" className="btn primary">
              Join Now
            </NavLink>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
