/**
 * SEO and JSON-LD Constants for ACME Academy
 * Centralized metadata for consistency across all pages
 */

export const ACME_COMPANY = {
  name: "ACME Academy",
  url: "https://www.acmeacademy.in",
  logo: "https://www.acmeacademy.in/logo.png",
  description: "India's most trusted MCA Entrance Coaching platform for NIMCET, CUET, MAH-CET, and JMI exams.",
  linkedin: "https://in.linkedin.com/company/acme-academy",
  socials: {
    facebook: "https://www.facebook.com/acmeacademynimcetmcacoaching",
    youtube: "https://www.youtube.com/c/ACMEACADEMYMCAENTRANCEACADEMYNIMCETAIMCA",
    instagram: "https://www.instagram.com/acmeacademy.in/",
    telegram: "https://t.me/Acme_Academy",
  },
};

export const ACME_DIRECTOR = {
  name: "Kartikey Pandey",
  jobTitle: "Director & Mathematics Mentor",
  qualification: "MCA, Ph.D. Scholar",
  image: "https://www.acmeacademy.in/assets/KP.png",
  alumniOf: "National Institute of Technology, Raipur",
  linkedin: "https://in.linkedin.com/in/dr-kartikey-pandey-98a23497",
};

export const ACME_SOCIAL_LINKS = [
  ACME_COMPANY.socials.facebook,
  ACME_COMPANY.socials.youtube,
  ACME_COMPANY.socials.instagram,
  ACME_COMPANY.socials.telegram,
  ACME_COMPANY.linkedin,
];

export const ACME_CONTACT_POINTS = [
  {
    "@type": "ContactPoint",
    "telephone": "+91-8109977628",
    "contactType": "Customer Support",
    "availableLanguage": ["English", "Hindi"],
  },
  {
    "@type": "ContactPoint",
    "contactType": "WhatsApp Support",
    "url": "https://wa.me/918109977628",
    "availableLanguage": ["English", "Hindi"],
  },
];

export const ACME_ADDRESS = {
  "@type": "PostalAddress",
  "streetAddress": "ACME Building, behind Kota Stadium, Kota, Raipur",
  "addressLocality": "Raipur",
  "addressRegion": "Chhattisgarh",
  "postalCode": "492010",
  "addressCountry": "IN",
};

/**
 * Default JSON-LD for EducationalOrganization
 * Can be used or extended in individual pages
 */
export const createAcmeJsonLd = (type = "EducationalOrganization") => {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: ACME_COMPANY.name,
    url: ACME_COMPANY.url,
    logo: ACME_COMPANY.logo,
    description: ACME_COMPANY.description,
    sameAs: ACME_SOCIAL_LINKS,
    founder: {
      "@type": "Person",
      name: ACME_DIRECTOR.name,
      jobTitle: ACME_DIRECTOR.jobTitle,
      qualification: ACME_DIRECTOR.qualification,
      image: ACME_DIRECTOR.image,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: ACME_DIRECTOR.alumniOf,
      },
      sameAs: [ACME_DIRECTOR.linkedin],
    },
    contactPoint: ACME_CONTACT_POINTS,
    address: ACME_ADDRESS,
  };
};
