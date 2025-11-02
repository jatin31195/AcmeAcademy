const DashboardLayout = ({ children }) => {
  return (
    <div className="w-full  relative">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-white opacity-70 -z-10"></div>

      <main className="px-3 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Acme Academy Arena
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg font-medium">
            Best MCA Coaching in India — Track your NIMCET journey, analyze performance, and achieve your dream college.
          </p>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
