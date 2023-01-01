import "./App.css";
import React from "react";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import { ethers } from "ethers";

const customNodeOptions = {
  rpcUrl: `https://goerli.infura.io/v3/${process.env.RPCURL}`,
  chainId: 5,
};

const magic = new Magic("pk_live_84BA7F7992259553", {
  network: customNodeOptions,
  extensions: [new ConnectExtension()],
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [eth, setEth] = React.useState(null);
  const [btc, setBtc] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((response) => setEth(response.message[1]));
  }, []);

  React.useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((response) => setBtc(response.message[0]));
  }, []);

  const handleLogin = async () => {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    provider.listAccounts().then((accounts) => console.log(accounts[0]));

    setIsLoggedIn(true);
  };

  const handleShowWallet = async () => {
    magic.connect.showWallet();
  };

  const handleDisconnect = async () => {
    magic.connect.disconnect();
    setIsLoggedIn(false);
  };

  return (
    <div className="main">
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Connect</button>
      ) : (
        <>
          <a href="https://goerlifaucet.com/" target="_blank" rel="noreferrer">
            Get some Ether
          </a>
          <button onClick={handleShowWallet}>Show Wallet!</button>
          <button onClick={handleDisconnect}>Disconnect</button>
          <p>cvrfvd price: {!btc ? "Loading..." : btc.toFixed(2)}</p>
          <p>vsdfvds price: {!eth ? "Loading..." : eth.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

export default App;
