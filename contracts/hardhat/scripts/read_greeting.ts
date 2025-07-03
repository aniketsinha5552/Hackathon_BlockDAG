import { ethers } from "hardhat";

async function main() {
  const greeter = await ethers.getContractAt("Greeter", "0xB131921a81d34411c252a63D940BE4b3c100DbD9");
  const greeting = await greeter.greet();
  console.log("Greeting from contract:", greeting);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
