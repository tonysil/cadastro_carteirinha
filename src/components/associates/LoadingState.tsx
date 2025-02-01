import React from "react";

const LoadingState = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};

export default LoadingState;