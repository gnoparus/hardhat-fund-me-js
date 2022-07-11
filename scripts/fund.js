const { network, ethers, getNamedAccounts } = require("hardhat");

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("Funding Contract...");
    const txResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.01"),
    });
    const txReceipt = await txResponse.wait(1);
    console.log("Funded!");
};

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
