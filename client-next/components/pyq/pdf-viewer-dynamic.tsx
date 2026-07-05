"use client";

import dynamic from "next/dynamic";

// `ssr: false` is only permitted inside a Client Component (Next.js
// restriction — it errors if used directly in a Server Component), so this
// thin "use client" wrapper is what the Server page.tsx imports, rather than
// calling dynamic() itself. The actual pdfjs-dist/react-pdf-viewer code
// touches browser-only APIs (canvas, workers) that can't run during SSR.
const PdfViewerClient = dynamic(() => import("./pdf-viewer-client").then((m) => m.PdfViewerClient), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-white">Loading viewer...</div>,
});

export default PdfViewerClient;
