import { Link } from "react-router-dom";
import logo from "/logo.png";

const OpenLibrary = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

      {/* Header */}
      <section className="relative py-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Open
            <span className="text-5xl md:text-6xl font-bold block text-white/90 gradient-text">Library</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Access our comprehensive collection of free study materials, books, notes, and guides for all MCA entrance examinations.
          </p>
        </div>
        {/* subtle decorative circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Special Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">

         
          <Link
            to="/acme-free-courses"
            className="relative group rounded-2xl overflow-hidden shadow-lg bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col justify-between text-gray-800 border border-gray-200"
          >
  
            <img
              src={logo}
              alt="Logo"
              className="absolute top-4 right-4 w-24 opacity-10 pointer-events-none"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <h2 className="text-2xl font-bold tracking-tight">Acme Free Self Study Courses</h2>
              </div>
              <p className="text-gray-700/90 mb-6 leading-relaxed">
                Access all MCA self-study courses curated for you. Learn at your own pace with complete resources, notes, and guides.
              </p>
              <span className="font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                Explore Courses →
              </span>
            </div>
          </Link>

        
          <Link
            to="/acme-practice-sets"
            className="relative group rounded-2xl overflow-hidden shadow-lg bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col justify-between text-gray-800 border border-gray-200"
          >
    
            <img
              src={logo}
              alt="Logo"
              className="absolute top-4 right-4 w-24 opacity-10 pointer-events-none"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <h2 className="text-2xl font-bold tracking-tight">Practice Sets</h2>
              </div>
              <p className="text-gray-700/90 mb-6 leading-relaxed">
                Test your knowledge with practice questions and sets from previous years’ MCA exams.
              </p>
              <span className="font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                Start Practicing →
              </span>
            </div>
          </Link>

        </div>
      </section>
    </div>
  );
};

export default OpenLibrary;
