const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let deployer;
          let fundMe;
          const sendValue = ethers.utils.parseEther("0.1");
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue });
              await fundMe.withdraw();

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              );
              assert.equal(endingFundMeBalance.toString(), "0");
          });
      });

// const { expect, assert } = require("chai");
// const { getNamedAccounts, ethers, network, deployments } = require("hardhat");
// const { developmentChains } = require("../../helper-hardhat-config");

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("FundMe Staging Tests", () => {
//           let fundMe;
//           let deployer;
//           const sendValue = ethers.utils.parseUnits("110000000", "gwei");

//           beforeEach(async () => {
//               deployer = (await getNamedAccounts()).deployer;
//               fundMe = await ethers.getContract("FundMe", deployer);
//           });

//           it("Dummy666", async () => {
//               console.log("Dummy666660");
//           });

//           it("allows people to fund and withdrow Staging", async () => {
//               console.log("fund");
//               await fundMe.fund({ value: sendValue });
//               console.log("withdraw");
//               const txResponse = await fundMe.withdraw();
//               console.log("wait");
//               const txReceipt = await txResponse.wait(1);

//               console.log("getBalance");
//               const endingBalance = await fundMe.provider.getBalance(
//                   fundMe.address
//               );
//               console.log(`assert : ${endingBalance}`);
//               assert.equal(endingBalance.toString(), "0");
//               console.log("finish");
//           });
//           it("Dummy", async () => {
//               console.log("Dummy4");
//           });
//       });
