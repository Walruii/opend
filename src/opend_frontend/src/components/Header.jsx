import React, { useEffect, useState } from "react";
import homeImage from "../assets/home-img.png";
import logo from "../assets/logo.png";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Gallery from "./Gallery";
import Minter from "./Minter";
import { opend_backend } from "../../../declarations/opend_backend";
import CURRENT_USER_ID from "../main";

function Header() {
  const [userGallery, setUserGallery] = useState();

  async function getNFTS() {
    const userNFTIds = await opend_backend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds);
    setUserGallery(<Gallery title={"My NFTs"} ids={userNFTIds} />);
  }

  useEffect(() => {
    getNFTS();
  }, []);
  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              {" "}
              <Link to="/collection">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route
          exact
          path="/"
          element={<img className="bottom-space" src={homeImage} />}
        />
        <Route path="/discover" element={<h1>Discover</h1>} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={userGallery} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
