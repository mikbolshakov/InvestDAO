import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export const getCurrentEthPrice = async () => {
  const address = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
  const chain = EvmChain.BSC;
  const response = await Moralis.default.EvmApi.token.getTokenPrice({
    address,
    chain,
  });

  return response.toJSON().usdPrice;
};
