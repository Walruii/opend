import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend_backend } from "../../../declarations/opend_backend";
import CURRENT_USER_ID from "../main";
import PriceLabel from "./PriceLabel";

function Item({ id, role }) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState(false);
  const [priceLable, setPriceLable] = useState();

  const localHost = "http://localhost:3000";
  const agent = new HttpAgent({ host: localHost });
  agent.fetchRootKey();
  const principalId = id;
  let NFTActor;

  async function loadNFT() {
    NFTActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: principalId,
    });

    const NFTname = await NFTActor.getName();
    const NFTowner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const NFTimage = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );
    setName(NFTname);
    setOwner(NFTowner.toString());
    setImage(NFTimage);

    if (role == "collection") {
      const nftIsListed = await opend_backend.isListed(id);
      if (nftIsListed) {
        setOwner("OpenD");
        setButton();
        setBlur({ filter: "blur(4px)" });
        setSellStatus(true);
      } else {
        setButton(<Button handleClick={handleSell} text="Sell" />);
      }
    } else {
      const originalOwner = await opend_backend.getOriginalOwner(id);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text="Buy" />);
      }

      const listingPrice = await opend_backend.getListedNFTPrice(id);

      setPriceLable(<PriceLabel price={listingPrice.toString()} />);
    }
  }

  function handleBuy() {
    console.log("buy");
  }

  let price;
  function handleSell() {
    console.log("Sell Clicked");
    setPriceInput(
      <input
        placeholder="Price in XFF"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    console.log("set price = " + price);
    const listingResult = await opend_backend.listItem(id, Number(price));
    console.log("listing: " + listingResult);
    if (listingResult == "Success") {
      const opendDId = await opend_backend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(opendDId);
      if (transferResult == "Success") {
        console.log("transfer: " + transferResult);
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setSellStatus(true);
      }
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          style={blur}
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLable}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus && "Listed"}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
