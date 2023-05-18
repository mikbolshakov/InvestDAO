import Moralis from "moralis";
import dotenv from "dotenv";
dotenv.config();

export const connectToMoralis = async () => {
  return Moralis.default.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
};
