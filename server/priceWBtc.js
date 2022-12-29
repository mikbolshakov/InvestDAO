const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');

const getCurrentBtcPrice = async () => {
  const address = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
  const chain = EvmChain.ETHEREUM;
  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain,
  });

  return response.toJSON().usdPrice;
}

module.exports = {getCurrentBtcPrice}