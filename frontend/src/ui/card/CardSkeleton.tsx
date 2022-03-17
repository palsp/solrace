import React from "react";

const CardSkeleton = () => {
  return (
    <div
      style={{
        border: "2px solid var(--color-secondary)",
        background: "var(--background-gradient-2)",
        display: "block",
        lineHeight: 2,
        padding: "1rem",
        marginBottom: "0.5rem",
        borderRadius: "0.5rem",
        width: 300,
        height: 368,
        opacity: 0.5,
        margin: "0 auto",
      }}
    ></div>
  );
};

export default CardSkeleton;
