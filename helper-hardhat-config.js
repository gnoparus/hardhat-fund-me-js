const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
        ethUsdPriceDec: 8,
    },
    137: {
        name: "polygon-main",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        ethUsdPriceDec: 8,
    },
    31337: {
        name: "localhost",
    },
    80001: {
        name: "polygon-test",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        ethUsdPriceDec: 8,
    },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = "100000000000";

module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER };
