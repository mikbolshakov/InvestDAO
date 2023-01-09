import "./App.css";
import React from "react";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import { ethers } from "ethers";
import axios from "axios";

const customNodeOptions = {
  rpcUrl: `https://goerli.infura.io/v3/${process.env.RPCURL}`,
  chainId: 5,
};

const magic = new Magic("pk_live_84BA7F7992259553", {
  network: customNodeOptions,
  extensions: [new ConnectExtension()],
});

const magicAuth = new Magic("pk_live_17B8AADB8167BF62");

/* FUNCTION */
function App() {
  const [isLogged, setIsLogged] = React.useState(false);
  const [isWantToLogin, setIsWantToLogin] = React.useState(true);
  const [takenAccount, setTakenAccount] = React.useState(false);
  // const [eth, setEth] = React.useState(null);
  // const [btc, setBtc] = React.useState(null);

  /* PRICES */
  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((response) => response.json())
  //     .then((response) => setEth(response.message[1]));
  // }, []);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((response) => response.json())
  //     .then((response) => setBtc(response.message[0]));
  // }, []);

  /* BUTTONS */
  // const [users, setUsers] = React.useState([]);
  // const getUsers = () => {
  //   axios.get("http://localhost:3005/auth/all").then((response) => {
  //     setUsers(response.data);
  //   });
  // };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = new FormData(event.target).get("email");
    if (email) {
      await magic.auth.loginWithEmailOTP({ email });
    }
      axios
      .post("http://localhost:3005/auth/login", {
        email: register.email,
        password: register.password,
      })
      .then((res) => {
        if (res) {
          setIsLogged(true);
        } else {
          alert("There is already a user with this email");
        }
      })
      .catch(() => {
        alert("An error occurred on the server");
      });
  };

  const takeAccount = async () => {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    provider.listAccounts().then((accounts) => console.log(accounts[0]));

    setTakenAccount(true);
  };

  const showWallet = async () => {
    magic.connect.showWallet();
  };

  const logoutAccount = async () => {
    magic.connect.disconnect();
    setTakenAccount(false);
  };

  const loggingOut = async () => {
    await magicAuth.user.logout();
    setIsLogged(false);
    setIsWantToLogin(true);
  };

  const signUp = () => {
    setIsWantToLogin(false);
  };

  // ФОРМА РЕГИСТРАЦИИИИИИИИИИИИИИИИИИИИИИИИИИ

  const [register, setRegister] = React.useState(() => {
    return {
      name: "",
      occupation: "",
      email: "",
      password: "",
    };
  });

  const changeInputRegister = (event) => {
    event.persist();
    setRegister((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const submitChackin = async (event) => {
    event.preventDefault();
    const email = new FormData(event.target).get("email");
    if (email) {
      await magic.auth.loginWithEmailOTP({ email });
    }
    axios
      .post("http://localhost:3005/auth/register", {
        name: register.name,
        occupation: register.occupation,
        email: register.email,
        password: register.password,
      })
      .then((res) => {
        if (res) {
          setIsLogged(true);
        } else {
          alert("There is already a user with this email");
        }
      })
      .catch(() => {
        alert("An error occurred on the server");
      });
  };

  return (
    <div className="main">
      {isLogged ? (
        <>
          <a href="https://goerlifaucet.com/" target="_blank" rel="noreferrer">
            Get some Ether
          </a>
          {/* <p>Bitcoin price: {!btc ? "Loading..." : btc.toFixed(2)}</p>
          <p>Ethereum price: {!eth ? "Loading..." : eth.toFixed(2)}</p> */}
          {!takenAccount ? (
            <button onClick={takeAccount}>Get wallet</button>
          ) : (
            <>
              <button onClick={showWallet}>Show Wallet!</button>
              <button onClick={logoutAccount}>Disconnect</button>
            </>
          )}
          <button onClick={loggingOut}>Log out from App</button>
        </>
      ) : (
        <>
          {isWantToLogin ? (
            <>
              <div>
                <h2>Please login</h2>
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    name="email"
                    required="required"
                    placeholder="Enter your email"
                  />
                  <input type="submit" />
                </form>
                <button onClick={signUp}>Sign up</button>
              </div>
            </>
          ) : (
            <>
              <div className="form">
                <h2>Register user:</h2>
                <form onSubmit={submitChackin}>
                  <p>
                    Name:{" "}
                    <input
                      type="name"
                      id="name"
                      name="name"
                      value={register.name}
                      onChange={changeInputRegister}
                    />
                  </p>
                  <p>
                    Occupation:{" "}
                    <input
                      type="occupation"
                      id="occupation"
                      name="occupation"
                      value={register.occupation}
                      onChange={changeInputRegister}
                    />
                  </p>
                  <p>
                    Email:{" "}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={register.email}
                      onChange={changeInputRegister}
                    />
                  </p>
                  <p>
                    Password:{" "}
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={register.password}
                      onChange={changeInputRegister}
                    />
                  </p>
                  <input type="submit" />
                </form>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
