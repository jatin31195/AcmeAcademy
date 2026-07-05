import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import Script from "next/script";
import { BASE_URL } from "@/lib/config";
import { BackButton, FullscreenButton } from "@/components/pyq/pdf-reader-toolbar";
import PdfViewerClient from "@/components/pyq/pdf-viewer-dynamic";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/pages/PdfReader.jsx. That original had NO <SEO>
// component at all — a gap identified in the Phase 1 audit — so
// generateMetadata here is new (approved gap-fix), not a port. Header
// (title/exam/year/branding) is now server-rendered from the same fetch;
// the PDF viewer itself is a Client Island via next/dynamic(ssr:false)
// since pdfjs-dist requires browser APIs.

type PdfData = { title: string; exam: string; year: string; pdfUrl: string };

async function fetchPdfData(id: string): Promise<PdfData | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/pyqs/${id}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const pdfData = await fetchPdfData(id);
  if (!pdfData) return {};

  const title = `${pdfData.title} | ACME Academy PYQ`;
  const description = `${pdfData.exam} ${pdfData.year} previous year question paper — download and practice with ACME Academy.`;

  return {
    title,
    description,
    alternates: { canonical: `/pyq/${id}` },
    openGraph: { type: "website", title, description, url: `/pyq/${id}`, siteName: SITE_NAME, locale: OG_LOCALE },
    twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE },
  };
}

export default async function PdfReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pdfData = await fetchPdfData(id);
  if (!pdfData) notFound();

  // Phase 4 SEO audit gap-fix: every other content-detail route
  // (questions/[slug], acme-practice-sets/*, open-library/[id]) emits
  // JSON-LD; this one didn't. New addition, not a port — PdfReader.jsx had
  // no JSON-LD to carry over in the first place.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: pdfData.title,
    description: `${pdfData.exam} ${pdfData.year} previous year question paper.`,
    url: `https://www.acmeacademy.in/pyq/${id}`,
    learningResourceType: "Previous Year Question Paper",
    educationalLevel: "Postgraduate Entrance",
    about: pdfData.exam,
    provider: {
      "@type": "EducationalOrganization",
      name: "ACME Academy",
      url: "https://www.acmeacademy.in",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col">
      <Script id="ld-pyq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{pdfData.title}</h2>
              <p className="text-sm text-gray-400">
                {pdfData.exam} • {pdfData.year}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ACME Academy" className="h-8 w-auto rounded-md" />
            <span className="font-semibold text-white tracking-wide">
              ACME <span className="text-indigo-400">PDF Reader</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FullscreenButton />
            <a href={pdfData.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition" title="Download PDF">
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-black overflow-auto">
        <PdfViewerClient fileUrl={pdfData.pdfUrl} />
      </div>

      <div className="text-center text-sm text-gray-400 pb-4">© {new Date().getFullYear()} ACME Academy – Empowering MCA Aspirants</div>
    </div>
  );
}
