// Ported verbatim from client/src/pages/PdfReader.jsx's `!pdfData` branch
// (the "❌ Paper not found" screen). Next's notFound() resolves to this
// file specifically (nearest not-found.tsx to where pyq/[id]/page.tsx calls
// notFound()), replacing what would otherwise be Next's bare default 404.
export default function PdfNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-lg font-semibold">
      ❌ Paper not found
    </div>
  );
}
