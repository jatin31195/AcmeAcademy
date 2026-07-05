"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

// Ported from client/src/pages/PdfReader.jsx's <Worker workerUrl={workerSrc}><Viewer .../></Worker>.
// The original imported the worker via Vite's `pdfjs-dist/build/pdf.worker.min.js?url`
// syntax, which has no Turbopack/webpack equivalent — this is a required
// technical adaptation (not a behavior change), using the standard
// react-pdf-viewer-recommended CDN worker URL pinned to the exact installed
// pdfjs-dist version so the worker and API versions always match.
const PDFJS_VERSION = "3.11.174";
const workerUrl = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;

export function PdfViewerClient({ fileUrl }: { fileUrl: string }) {
  return (
    <Worker workerUrl={workerUrl}>
      <Viewer fileUrl={fileUrl} />
    </Worker>
  );
}
