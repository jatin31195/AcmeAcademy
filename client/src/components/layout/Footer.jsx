import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import logo from "/logo.png";

const Footer = () => {
  const examLinks = [
    "NIMCET", "CUET-PG MCA", "MAH-CET MCA", "JMI MCA", "BIT MCA", "VIT MCA", "DU MCA"
  ];

  const quickLinks = [
    { label: "About Us", path: "/about" },
    { label: "Open Library", path: "/library" },
    { label: "PYQ Papers", path: "/pyq" },
    { label: "Exam Pattern", path: "/exam-pattern" },
    { label: "Results", path: "/results" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="ACME Academy" className="h-14 w-auto" />
              <div>
                <h3 className="text-xl font-heading font-bold gradient-text">
                  ACME Academy
                </h3>
                <p className="text-base text-muted-foreground">
                  MCA Entrance Academy
                </p>
              </div>
            </div>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Your gateway to MCA success. Expert coaching for all major MCA entrance exams with a proven track record of 95% success rate.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Youtube className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground mb-6 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-base text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exams */}
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground mb-6 uppercase tracking-wide">
              MCA Exams
            </h4>
            <ul className="space-y-3">
              {examLinks.map((exam) => (
                <li key={exam}>
                  <Link
                    to={`/exams/${exam.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-base text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {exam}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground mb-6 uppercase tracking-wide">
              Our Centers
            </h4>
            <div className="space-y-5">
              {/* Raipur Center */}
              {/* Raipur Center */}
<div>
  <h5 className="text-base font-medium text-foreground mb-3">Raipur Center</h5>
  <div className="space-y-3">
    <a
      href="https://maps.app.goo.gl/d7TJY2bcB8nB3WHQ8"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start space-x-2 hover:text-primary transition-colors"
    >
      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <p className="text-base text-muted-foreground">
        ACME Building, behind Kota Stadium, Kota, Raipur, Chhattisgarh 492010
      </p>
    </a>
    <a
      href="tel:+918109977628"
      className="flex items-center space-x-2 hover:text-primary transition-colors"
    >
      <Phone className="h-5 w-5 text-primary" />
      <p className="text-base text-muted-foreground">+91 8109977628</p>
    </a>
  </div>
</div>


              {/* Kanpur Center */}
              <div>
                <h5 className="text-base font-medium text-foreground mb-3">Kanpur Center</h5>
                <div className="space-y-3">
                  <a
                    href="https://maps.google.com/?q=Geeta Nagar, Kanpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-2 hover:text-primary transition-colors"
                  >
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">Geeta Nagar, Kanpur</p>
                  </a>
                  <a
                    href="tel:+919516001679"
                    className="flex items-center space-x-2 hover:text-primary transition-colors"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <p className="text-base text-muted-foreground">+91 9516001679</p>
                  </a>
                </div>
              </div>

              {/* Email */}
              <a
                href="mailto:info@acmeacademy.com"
                className="flex items-center space-x-2 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-base text-muted-foreground">info@acmeacademy.com</p>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-base text-muted-foreground">
            © 2024 ACME Academy. All rights reserved. | Designed by Jatin Rajput
          </p>
          <div className="flex space-x-8 mt-4 sm:mt-0">
            <Link
              to="/privacy"
              className="text-base text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-base text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/refund"
              className="text-base text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
