const { getNamedAccounts, deployments, network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (developmentChains.includes(network.name)) {
        log("Local network detected deploying mocks...");
        const mockV3Aggregator = await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        });
        log("Mock deployed.");
        log("------------------------------------------------------------");
    }
};
module.exports.tags = ["all", "mocks"];
