/**
 * RankPredictorLayout
 *
 * The rank-predictor pages were authored for a full-screen flex column
 * (their old App used height:100dvh). Inside the ACME site they render
 * between the site Navbar and Footer, so we re-establish a flex column with
 * a sensible minimum height here — that lets the pages' inner `flex:1`
 * sections (e.g. the OTP split panel) fill the area as intended.
 */
const RankPredictorLayout = ({ children }) => (
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

export default RankPredictorLayout;
