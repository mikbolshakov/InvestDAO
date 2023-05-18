const hre = require("hardhat");

async function main() {
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D"
  );

  await staking.deployed();

  console.log(`deployed to ${staking.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
