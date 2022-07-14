const { expect, assert } = require("chai");
const { getNamedAccounts, ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", () => {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("0.01");

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });
          //   afterEach(async () => {
          //       delete deployer;
          //       delete fundMe;
          //   });

          it("allows people to fund and withdraw Staging", async () => {
              console.log("fund");
              await fundMe.fund({ value: sendValue });
              console.log("withdraw");
              const txResponse = await fundMe.withdraw();
              console.log("wait");
              const txReceipt = await txResponse.wait(1);

              console.log("getBalance");
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              console.log(`assert : ${endingBalance}`);
              assert.equal(endingBalance.toString(), "0");
              console.log("finish");
          });
          it("Dummy", async () => {
              console.log("Dummy4");
          });
      });
