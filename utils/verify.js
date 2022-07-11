const { getNamedAccounts, deployments, run, network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

const verify = async (addr, args) => {
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        try {
            await run("verify:verify", {
                address: addr,
                constructorArguments: args,
            });
        } catch (e) {
            if (e.message.toLowerCase().includes("already verified")) {
                console.log("Already verfified");
            }
        }
    }
};

module.exports = { verify };
