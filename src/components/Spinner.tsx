import React, { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "teal",
  borderStyle: "solid",
  borderWidth: "4px",
  borderRadius: "50%",
  animationDuration: "2s",
};

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ loading }) => {
  return (
    <div>
      <ClipLoader
        loading={loading}
        cssOverride={override}
        size={100}
        speedMultiplier={0.5}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;
