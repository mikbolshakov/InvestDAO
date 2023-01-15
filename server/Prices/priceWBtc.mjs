import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

export const getCurrentBtcPrice = async () => {
  const address = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
  const chain = EvmChain.ETHEREUM;
  const response = await Moralis.default.EvmApi.token.getTokenPrice({
    address,
    chain,
  });

  return response.toJSON().usdPrice;
}

