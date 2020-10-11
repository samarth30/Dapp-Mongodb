import React from "react";

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-dark bg-dark shadow mb-5">
      <p className="navbar-brand my-auto">
        <span>
          <a href="/" style={{ color: "#ffffff" }}>
            react website
          </a>{" "}
        </span>
        <span style={{ paddingLeft: "10px" }}>
          <a href="/faucet" style={{ color: "#ffffff" }}>
            dai faucet
          </a>{" "}
        </span>
      </p>
      <ul className="navbar-nav">
        <li className="nav-item text-white">{props.account}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
