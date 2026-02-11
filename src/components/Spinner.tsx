import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"
        style={{ animationDuration: "1.5s" }}
      ></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );
};

export default Spinner;
