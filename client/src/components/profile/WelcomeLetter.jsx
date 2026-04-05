import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import acmeLogo from "/logo.png";

const WelcomeLetter = ({ data }) => {
  const letterRef = useRef(null);

  const downloadAsImage = async () => {
    if (!letterRef.current) return;

    const { default: html2canvas } = await import("html2canvas");

    const canvas = await html2canvas(letterRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `ACME_Academy_Welcome_${data.fullName.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">

      <div
        ref={letterRef}
        className="bg-card border border-border rounded-lg overflow-hidden max-w-2xl mx-auto"
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >

        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, hsl(355 85% 48%), hsl(215 80% 52%))",
            padding: "24px 32px",
          }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img src={acmeLogo} alt="Acme Academy" className="w-14 h-14 rounded-lg bg-card p-1" />
            <div>
              <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: 0 }}>
                ACME Academy
              </h3>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: 0 }}>
                MCA Entrance Academy
              </p>
            </div>
          </div>

          <div style={{ color: "white", textAlign: "right", fontSize: 11, opacity: 0.8 }}>
            <p style={{ margin: 0 }}>www.acmeacademy.in</p>
            <p style={{ margin: 0 }}>
              Student ID: AA-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "hsl(355 85% 48%)",
              marginBottom: 4,
            }}
          >
            🎉 Welcome to ACME Academy!
          </h2>

          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginBottom: 28 }}>
            Your Gateway to MCA Success
          </p>

          {/* Details Table */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                {[
                  ["Full Name", data.fullName],
                  ["Username", data.username],
                  ["Mobile", data.mobile],
                  ["Email", data.email],
                  ["Target Exams", data.targetExams.join(", ")],
                  ["Target Year", data.targetYear],
                ].map(([label, val]) => (
                  <tr key={label}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "#334155", width: "40%" }}>
                      {label}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#475569" }}>
                      {val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quote */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
              "Success is not the key to happiness. Happiness is the key to success."
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>— Albert Schweitzer</p>
          </div>

          {/* Message */}
          <p
            style={{
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.6,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            We are thrilled to have you on board! At ACME Academy, we are committed
            to providing you the best guidance for your MCA entrance preparation.
            Work hard, stay focused, and remember — your dreams are just an exam away! 🚀
          </p>

          {/* Signature */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 28,
              paddingTop: 16,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <div>
              {data.signature && (
                <img src={data.signature} alt="Student Signature" style={{ height: 40 }} />
              )}
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                Student Signature
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, maxWidth: 200 }}>
                *Terms & Conditions apply. Fees non-refundable. ACME Academy reserves all rights.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#1e293b", padding: "12px 32px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 11, margin: 0 }}>
            © {new Date().getFullYear()} ACME Academy | All the best! 🌟
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          onClick={downloadAsImage}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Welcome Letter
        </Button>
      </div>
    </div>
  );
};

export default WelcomeLetter;