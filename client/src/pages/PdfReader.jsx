import { useParams, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Maximize2, Search, ZoomIn, ZoomOut } from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import { BASE_URL } from "../config";
const PDFReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!pdfData) return <div className="p-10 text-center">❌ Paper not found</div>;


  const pdfUrl = pdfData.pdfUrl;

  return (
    <div className="pt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white">
 
      <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 py-3">
      
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">{pdfData.title}</h2>
        </div>

      
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ACME" className="h-8 w-auto" />
          <span className="font-bold text-lg gradient-text">ACME PDFReader</span>
        </div>

      
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <ZoomOut className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <ZoomIn className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Maximize2 className="h-5 w-5" />
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      </div>

      
      <div className="max-w-9xl mx-auto p-6">
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white h-[85vh]">
          <Worker workerUrl={workerSrc}>
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]}  renderMode="canvas" defaultScale={1.0}/>
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
