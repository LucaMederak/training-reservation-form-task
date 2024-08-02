import React from "react";

const SkeletonLoadingGrid = ({
  columns,
  rows,
}: {
  columns?: number;
  rows?: number;
}) => {
  const loadingRows = Array(rows || 10).fill("");
  const loadingRowSkeleton = Array(columns || 1).fill("");

  return (
    <div className="flex flex-col w-96 gap-5 max-w-screen-xl">
      {loadingRows.map((_, index) => (
        <div key={index} className="flex w-full gap-5 animate-pulse">
          {loadingRowSkeleton.map((_, index) => (
            <div
              key={index}
              className="h-10 bg-primary-200/20 rounded flex-grow"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoadingGrid;
