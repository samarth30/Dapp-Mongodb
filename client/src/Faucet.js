import React from "react";

const Faucet = ({ getdai }) => {
  return (
    <div>
      <button onClick={getdai} className="btn btn-primary">
        get dai
      </button>
    </div>
  );
};

export default Faucet;
