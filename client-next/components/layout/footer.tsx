import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Ported from client/src/components/layout/Footer.jsx. No hooks/browser
// APIs (`new Date().getFullYear()` is safe at render time, incl. on the
// server) — stays a Server Component per the migration blueprint's
// component conversion plan.
const examLinks = ["NIMCET", "CUET-PG MCA", "MAH-CET MCA", "JMI MCA", "BIT MCA", "VIT MCA", "DU MCA"];

const quickLinks = [
  { label: "About Us", path: "/about" },
  { label: "Acme Library", path: "/acme-academy-open-library" },
  { label: "PYQ Papers", path: "/pyq" },
  { label: "Exam Pattern", path: "/exam-pattern" },
  { label: "Results", path: "/acme-academy-results" },
  { label: "Contact Us", path: "/contact-acme-academy" },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/logo.png" alt="ACME Academy" width={842} height={711} className="h-14 w-auto" />
              <div>
                <h3 className="text-xl font-heading font-bold gradient-text">ACME Academy</h3>
                <p className="text-base text-muted-foreground">MCA Entrance Academy</p>
              </div>
            </div>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Your gateway to MCA success. Expert coaching for all major MCA entrance exams with a
              proven track record of 95% success rate.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              <a href="https://t.me/Acme_Academy" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Send className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://www.facebook.com/acmeacademynimcetmcacoaching"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/acmeacademy.in/" target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost" className="hover-glow">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://www.youtube.com/c/ACMEACADEMYMCAENTRANCEACADEMYNIMCETAIMCA"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                    href={link.path}
                    className="text-base text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    {link.label === "Acme Library" && (
                      <Image src="/logo.png" alt="ACME" width={842} height={711} className="h-4 w-auto" />
                    )}
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
                  {/* No dedicated per-exam page exists yet — point at the real
                      Exam Pattern page (covers NIMCET/CUET-PG/MAH-CET/JMI/VIT)
                      instead of the previously dead /exams/:slug route. */}
                  <Link
                    href="/exam-pattern"
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
          <p className="text-base text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} ACME Academy. All rights reserved. |{" "}
            <a
              href="mailto:xyz.codeverse@gmail.com"
              className="text-base text-muted-foreground hover:text-primary transition-colors duration-200 underline-offset-2"
              aria-label="Email CodeHatch"
            >
              Developed by CodeHatch
            </a>
          </p>

          <div className="flex space-x-8 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-base text-muted-foreground hover:text-primary transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-base text-muted-foreground hover:text-primary transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/refund" className="text-base text-muted-foreground hover:text-primary transition-colors duration-200">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
