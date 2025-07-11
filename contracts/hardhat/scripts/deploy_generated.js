
const hre = require("hardhat");

async function main() {
    const Governance = await hre.ethers.getContractFactory("Governance");
    const contract = await Governance.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("Governance deployed to:", address);
    
    // Return deployment info as JSON
    console.log(JSON.stringify({
        success: true,
        contractAddress: address,
        network: "primordial",
        contractName: "Governance"
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
