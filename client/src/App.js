import "./App.css";
import React from "react";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import { ethers } from "ethers";
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()

const customNodeOptions = {
  rpcUrl: `https://goerli.infura.io/v3/${process.env.RPCURL}`,
  chainId: 5,
};

const magic = new Magic("pk_live_EC3A353BCCF9860E", {
  network: customNodeOptions,
  extensions: [new ConnectExtension()],
});

const magicAuth = new Magic("pk_live_CCFD8E3A55EED8B8");

/* FUNCTION */
function App() {
  const [isLogged, setIsLogged] = React.useState(false);
  const [isWantToLogin, setIsWantToLogin] = React.useState(true);
  const [eth, setEth] = React.useState(null);
  const [btc, setBtc] = React.useState(null);
  const [account, setAccount] = React.useState(null);

  /* PRICES */
  React.useEffect(() => {
    const btcPrice = async () => {
      try {
        const response = await axios.get("http://localhost:3005/api");
        setBtc(response.data.message[0]);
        setEth(response.data.message[1]);
      } catch (error) {
        console.error(error.message);
      }
    }
    btcPrice();
  }, []);

  /* BUTTONS */
  // LOGIN
  const [logging, setLogging] = React.useState(() => {
    return {
      email: "",
    };
  });

  const changeInputLogin = (event) => {
    event.persist();
    setLogging((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3005/auth/login", {
        email: logging.email,
      })
      .then(async (res) => {
        if (res) {
          console.log("ответ от БД ок");
          const email = new FormData(event.target).get("email");
          if (email) {
            await magic.auth.loginWithEmailOTP({ email });
          }
          if (magicAuth.user.isLoggedIn()) {
            setIsLogged(true);
          }
        } else {
          alert("не получили ответ от БД");
        }
      })
      .catch((res) => {
        alert("Пользователь не зарегестрирован");
      });
  };

  const handleRegistration = () => {
    setIsWantToLogin(false);
  };

  // WALLET
  const takeWallet = () => {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    provider.listAccounts().then((accounts) => {
      setAccount(accounts?.[0])
    });
  };

  const showWallet = () => {
    magic.connect.showWallet().catch((e) => {
      console.log(e);
    });
  };

  const logoutWallet = async () => {
    await magic.connect.disconnect().catch((e) => {
      console.log(e);
    });
    setAccount(null);
  };

  // LOGOUT
  const loggingOutFromApp = () => {
    if (magicAuth.user.logout()) {
      setIsLogged(false);
      setIsWantToLogin(true);
    } else {
      console.log("не работает логаут");
    }
  };

  // ФОРМА РЕГИСТРАЦИИ

  const [register, setRegister] = React.useState(() => {
    return {
      name: "",
      occupation: "",
      email: "",
    };
  });

  const changeInputRegistration = (event) => {
    event.persist();
    setRegister((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleRegistrationToDB = async (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3005/auth/register", {
        name: register.name,
        occupation: register.occupation,
        email: register.email,
      })
      .then(async (res) => {
        if (res) {
          console.log("регистрация в БД ок");
          const email = new FormData(event.target).get("email");
          if (email) {
            await magic.auth.loginWithEmailOTP({ email });
          }
          if (magicAuth.user.isLoggedIn()) {
            setIsLogged(true);
          }
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
      <p>Bitcoin price: {!btc ? "loading..." : btc.toFixed(2)}</p>
      <p>Ethereum price: {!eth ? "loading..." : eth.toFixed(2)}</p>
      {isLogged ? (
        <>
          <a href="https://goerlifaucet.com/" target="_blank" rel="noreferrer">
            Get some Ether
          </a>
          {!account && (
            <button onClick={takeWallet}>Get wallet</button>
          )}
          {account && (
            <>
              <button onClick={showWallet}>Show Wallet!</button>
              <button onClick={logoutWallet}>Disconnect</button>
            </>
          )}
          <button onClick={loggingOutFromApp}>Log out from App</button>
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
                    value={logging.email}
                    onChange={changeInputLogin}
                    required="required"
                    placeholder="Enter your email"
                  />
                  <input type="submit" />
                </form>
                <button onClick={handleRegistration}>Sign up</button>
              </div>
            </>
          ) : (
            <>
              <div className="form">
                <h2>Register user:</h2>
                <form onSubmit={handleRegistrationToDB}>
                  <p>
                    Name:{" "}
                    <input
                      type="name"
                      id="name"
                      name="name"
                      value={register.name}
                      onChange={changeInputRegistration}
                    />
                  </p>
                  <p>
                    Occupation:{" "}
                    <input
                      type="occupation"
                      id="occupation"
                      name="occupation"
                      value={register.occupation}
                      onChange={changeInputRegistration}
                    />
                  </p>
                  <p>
                    Email:{" "}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={register.email}
                      onChange={changeInputRegistration}
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
