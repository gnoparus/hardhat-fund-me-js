const { getNamedAccounts, deployments, network, run } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts,
}) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // when network localhost or hardhat, use mock
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    log(`ethUsdPriceFeedAddress : ${ethUsdPriceFeedAddress}`);

    log(`deployer : ${deployer}`);

    const fundMeArgs = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: fundMeArgs, // put priceFeedAddress
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`Verifying address : ${fundMe.address}`);
    await verify(fundMe.address, fundMeArgs);
    log("------------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
