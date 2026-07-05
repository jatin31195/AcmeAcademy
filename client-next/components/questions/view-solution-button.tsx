"use client";

// Ported from client/src/pages/QuestionSEOPage.jsx's inline onClick handler.
// This is the ONLY interactive part of the page (scrolls to #solution-section),
// so it's the sole Client Island — everything else on the page stays a Server
// Component per the migration blueprint's component conversion plan.
export function ViewSolutionButton({ hasSolution }: { hasSolution: boolean }) {
  if (!hasSolution) {
    return (
      <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
        Solution Coming Soon
      </button>
    );
  }

  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      onClick={() => {
        const explanationEl = document.getElementById("solution-section");
        if (explanationEl) explanationEl.scrollIntoView({ behavior: "smooth" });
      }}
    >
      View Solution
    </button>
  );
}
