import React, { useEffect, useState, Fragment } from "react";
import Helloabi from "./contracts/Hello.json";
import Web3 from "web3";
import Navbar from "./Navbar";
import PaymentProcessor from "./contracts/PaymentProcessor.json";
import Dai from "./contracts/Dai.json";
import Store from "./Store";
import Faucet from "./Faucet";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
  // useHistory,
} from "react-router-dom";

const App = () => {
  const [refresh, setrefresh] = useState(0);

  let content;
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentProcessor, setPaymentprocessor] = useState();
  const [DAI, setDAI] = useState();
  const [daiaddress, serdaiaddress] = useState("");
  const [paymentprocessaddress, setpaymentprocessoraddress] = useState("");
  const [daibalance, setdaibalance] = useState(0);
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (
      typeof window.ethereum == "undefined" ||
      typeof window.web3 == "undefined"
    ) {
      return;
    }
    const web3 = window.web3;

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length == 0) {
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = PaymentProcessor.networks[networkId];
    console.log(networkData);
    if (networkData) {
      const paymentprocessor = await new web3.eth.Contract(
        PaymentProcessor.abi,
        PaymentProcessor.networks[networkId].address
      );
      setpaymentprocessoraddress(
        PaymentProcessor.networks[networkId].address.toString()
      );
      setPaymentprocessor(paymentprocessor);

      const daitoken = await new web3.eth.Contract(
        Dai.abi,
        Dai.networks[networkId].address
      );
      serdaiaddress(Dai.networks[networkId].address.toString());
      console.log(daitoken);
      let balance = await daitoken.methods.balanceOf(accounts[0]).call();
      let balancein18decmal = window.web3.utils.fromWei(balance);
      setdaibalance(balancein18decmal);
      console.log(balance);
      setDAI(daitoken);

      setLoading(false);
    } else {
      window.alert("Forsage contract not deployed to detected network.");
      setloading2(true);
    }
  };
  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  const getdai = async () => {
    await DAI.methods
      .faucet(account, "1000000000000000000000")
      .send({ from: account })
      .once("receipt", async (receipt) => {
        console.log("sucess");
      })
      .on("error", (error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div class="container">
        <main role="main" class="container">
          <div class="jumbotron">
            <div className="row">
              <h1 style={{ paddingLeft: "20px" }}>E-Commerce Market Place </h1>
              <h4 style={{ paddingLeft: "300px" }}>
                {" "}
                Balance : {daibalance} DAI
              </h4>
            </div>
            <Router>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <Fragment>
                      <Store
                        paymentProcessor={paymentProcessor}
                        dai={DAI}
                        account={account}
                        daiaddress={daiaddress}
                        paymentprocessaddress={paymentprocessaddress}
                      />
                    </Fragment>
                  )}
                />

                <Route
                  exact
                  path="/faucet"
                  render={() => (
                    <Fragment>
                      <Faucet getdai={getdai} />
                    </Fragment>
                  )}
                />
              </Switch>
            </Router>

            {/* <div className="row" style={{ paddingTop: "30px" }}>
              {" "}
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>text 1</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>text 2</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>text 3</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <button className="btn btn-primary">Click on it</button>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
