import React from "react";
import { useNavigate } from "react-router-dom";
import { RP_BASE } from "../constants.js";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-black text-white">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl backdrop-blur-xl border border-white/10 text-center transform hover:scale-[1.02] transition-transform duration-300">
        <div className="text-6xl mb-6 animate-bounce">
          😂
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          Access Denied
        </h1>
        <p className="text-lg text-slate-300 mb-8 font-medium">
          YOU ARE PRANKED. HOW WILL I GIVE YOU THE ADMIN ACCESS SO EASILY 😂😂😂😂
        </p>
        <button
          onClick={() => navigate(RP_BASE)}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
