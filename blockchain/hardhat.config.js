require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

const { API_URL, PRIVATE_KEY, YOUR_ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: { 
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
       },
   },
   etherscan: {
    apiKey: YOUR_ETHERSCAN_API_KEY
  }
};
