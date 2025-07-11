
const hre = require("hardhat");

async function main() {
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    const contract = await SimpleStorage.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("SimpleStorage deployed to:", address);
    
    // Return deployment info as JSON
    console.log(JSON.stringify({
        success: true,
        contractAddress: address,
        network: "primordial",
        contractName: "SimpleStorage"
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
