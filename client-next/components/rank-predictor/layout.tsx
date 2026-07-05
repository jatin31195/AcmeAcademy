// Ported verbatim from client/src/features/rank-predictor/RankPredictorLayout.jsx.
//
// The rank-predictor pages were authored for a full-screen flex column
// (their old App used height:100dvh). Inside the ACME site they render
// between the site Navbar and Footer, so we re-establish a flex column with
// a sensible minimum height here — that lets the pages' inner `flex:1`
// sections (e.g. the OTP split panel) fill the area as intended.
export default function RankPredictorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        paddingTop: "64px", // offset the site's fixed navbar (h-16) so content isn't hidden
        backgroundColor: "#ffffff",
        color: "#0f172a",
      }}
    >
      {children}
    </div>
  );
}
