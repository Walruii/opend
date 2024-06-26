import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend_backend } from "../../../declarations/opend_backend";

function Item({ id }) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();

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
    setButton(<Button handleClick={handleSell} text="Sell" />);
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
    console.log("set price = " + price);
    const listingResult = await opend_backend.listItem(id, Number(price));
    console.log("listing: " + listingResult);
    if (listingResult == "Success") {
      const opendDId = await opend_backend.getOpenDCanisterID();
      await NFTActor.transferOwnership(opendDId);
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
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
