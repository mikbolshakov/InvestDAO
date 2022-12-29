const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');
const dotenv = require('dotenv')
dotenv.config()

const connectToMoralis = async () => {
  return Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
}

module.exports = {connectToMoralis}