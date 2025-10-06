import React from "react";

const Courses = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe
        src="https://acmea.courses.store/"
        title="ACME Academy Courses"
        className="w-full h-full"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default Courses;
