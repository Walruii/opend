import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft"
import { Principal } from "@dfinity/principal";

function Item({ id }) {

  const [name, setName] = useState()
  const [owner, setOwner] = useState()
  const [image, setImage] = useState()

  const localHost = "http://localhost:3000"
  const agent = new HttpAgent({ host: localHost });
  const principalId = Principal.fromText(id);

  async function loadNFT() {
    const NFTActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: principalId,
    });

    const NFTname = await NFTActor.getName();
    const NFTowner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const NFTimage = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    )
    setName(NFTname);
    setOwner(NFTowner.toString());
    setImage(NFTimage);

  }

  useEffect(() => {
    loadNFT();
  }, [])

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
