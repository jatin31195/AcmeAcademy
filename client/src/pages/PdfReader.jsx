import { useParams, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Maximize2 } from "lucide-react";
import { BASE_URL } from "../config";

const PDFReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pyqs/${id}`);
        if (!res.ok) throw new Error("Paper not found");
        const data = await res.json();
        setPdfData(data);
      } catch (err) {
        console.error(err);
        setPdfData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPDF();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-lg font-semibold">
        Loading paper...
      </div>
    );

  if (!pdfData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-lg font-semibold">
        ❌ Paper not found
      </div>
    );

  const pdfUrl = pdfData.pdfUrl;

  const handleFullScreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                {pdfData.title}
              </h2>
              <p className="text-sm text-gray-400">
                {pdfData.exam} • {pdfData.year}
              </p>
            </div>
          </div>

          {/* Center: Branding */}
          <div className="hidden sm:flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ACME Academy"
              className="h-8 w-auto rounded-md"
            />
            <span className="font-semibold text-white tracking-wide">
              ACME <span className="text-indigo-400">PDF Reader</span>
            </span>
          </div>

          {/* Right: Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFullScreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              title="Fullscreen"
            >
              <Maximize2 className="h-5 w-5" />
            </button>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-grow bg-black overflow-auto">
        <Worker workerUrl={workerSrc}>
          <Viewer fileUrl={pdfUrl} />
        </Worker>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 pb-4">
        © {new Date().getFullYear()} ACME Academy – Empowering MCA Aspirants
      </div>
    </div>
  );
};

export default PDFReader;
