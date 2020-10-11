import React from "react";
import { ethers } from "ethers";
import axios from "axios";

const API_URL = "http://localhost:4000";

const ITEMS = [
  {
    id: 1,
    price: ethers.utils.parseEther("100"),
  },
  {
    id: 2,
    price: ethers.utils.parseEther("200"),
  },
];

function Store({
  paymentProcessor,
  dai,
  account,
  paymentprocessaddress,
  daiaddress,
}) {
  const buy = async (item) => {
    const response1 = await axios.get(
      `${API_URL}/api/getPaymentId/${item.id}/${account}`
    );

    await dai.methods
      .approve(paymentprocessaddress, item.price.toString())
      .send({ from: account })
      .once("receipt", async (receipt) => {})
      .on("error", (error) => {
        console.log(error);
      });

    await paymentProcessor.methods
      .pay(item.price.toString(), response1.data.paymentId.toString())
      .send({ from: account })
      .once("receipt", async (receipt) => {})
      .on("error", (error) => {
        console.log(error);
      });

    await new Promise((resolve) => setTimeout(resolve, 5000));
    const response2 = await axios.get(
      `${API_URL}/api/getItemUrl/${response1.data.paymentId}`
    );
    console.log(response2);
  };

  return (
    <ul className="list-group">
      <li className="list-group-item">
        Buy item1 - <span className="font-weight-bold">100 DAI</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => buy(ITEMS[0])}
        >
          Buy
        </button>
      </li>
      <li className="list-group-item">
        Buy item2 - <span className="font-weight-bold">200 DAI</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => buy(ITEMS[1])}
        >
          Buy
        </button>
      </li>
    </ul>
  );
}

export default Store;
