import type { MetadataRoute } from "next";

// Web app manifest generated via Next.js's file convention (served at
// /manifest.webmanifest). Uses only the existing /icon.png — no new icon
// assets are introduced.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ACME Academy - Best MCA Coaching in India",
    short_name: "ACME Academy",
    description:
      "India's top MCA entrance coaching institute for NIMCET, CUET-PG, MAH-CET, JMI, and VIT MCA exams.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0072CE",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
