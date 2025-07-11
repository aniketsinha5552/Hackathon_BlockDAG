
const hre = require("hardhat");

async function main() {
    const HelloWorld = await hre.ethers.getContractFactory("HelloWorld");
    const contract = await HelloWorld.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("HelloWorld deployed to:", address);
    
    // Return deployment info as JSON
    console.log(JSON.stringify({
        success: true,
        contractAddress: address,
        network: "primordial",
        contractName: "HelloWorld"
    }));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        console.log(JSON.stringify({
            success: false,
            error: error.message
        }));
        process.exit(1);
    });
