const { network, ethers, getNamedAccounts } = require("hardhat");

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);

    const txResponse = await fundMe.withdraw();
    const txReceipt = await txResponse.wait(1);
    console.log("Withdrawed!");
};

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
