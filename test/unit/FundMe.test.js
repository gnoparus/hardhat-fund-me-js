const { expect, assert } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let fundMe;
          let deployer;
          let mockV3Aggregator;
          const sendValue = ethers.utils.parseEther("0.01");

          beforeEach(async () => {
              const namedAccount = await getNamedAccounts();
              deployer = namedAccount.deployer;
              const accounts = await ethers.getSigners();
              const account0 = accounts[0];

              await deployments.fixture("all");
              fundMe = await ethers.getContract("FundMe", deployer);

              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });
          describe("Constructor", () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });
          describe("Fund", () => {
              it("Fails if you don't send enough ETH", async () => {
                  // await expect(fundMe.fund()).to.be.reverted;

                  await expect(fundMe.fund()).to.be.revertedWith(
                      "FundMe__NotEnouchETH"
                  );
              });
              it("Updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  );
                  assert.equal(response.toString(), sendValue.toString());
              });
              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getFunder(0);
                  assert.equal(response.toString(), deployer);
              });
          });
          describe("Withdraw", () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });
              it("withdraw ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  console.log(
                      `startingFundMeBalance : ${startingFundMeBalance}`
                  );
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `startingDeployerBalance : ${startingDeployerBalance}`
                  );
                  // Act
                  const txResponse = await fundMe.withdraw();
                  const txReceipt = await txResponse.wait(1);
                  const gasCost = txReceipt.gasUsed.mul(
                      txReceipt.effectiveGasPrice
                  );
                  console.log(`gasCost : ${gasCost}`);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  console.log(`endingFundMeBalance : ${endingFundMeBalance}`);
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `endingDeployerBalance : ${endingDeployerBalance}`
                  );

                  // Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });
              it("allow us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  console.log(
                      `to fund contract by 5/${accounts.length} accounts`
                  );
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      );
                      const sendValueByAccount = sendValue.add(
                          ethers.utils.parseUnits(
                              (i * 10000000).toString(),
                              "gwei"
                          )
                      );
                      console.log(
                          `funded by ${i} with : ${sendValueByAccount}`
                      );
                      await fundMeConnectedContract.fund({
                          value: sendValueByAccount,
                      });
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);

                  console.log(
                      `startingFundMeBalance : ${startingFundMeBalance}`
                  );
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `startingDeployerBalance : ${startingDeployerBalance}`
                  );

                  // Act
                  const txResponse = await fundMe.withdraw();
                  const txReceipt = await txResponse.wait(1);
                  const gasCost = txReceipt.gasUsed.mul(
                      txReceipt.effectiveGasPrice
                  );
                  console.log(`gasCost : ${gasCost}`);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  console.log(`endingFundMeBalance : ${endingFundMeBalance}`);
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `endingDeployerBalance : ${endingDeployerBalance}`
                  );

                  // Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          0,
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          )
                      );
                  }
              });
              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];

                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  );
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner");
              });
          });
          describe("WithdrawCheap", () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });
              it("withdraw ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  console.log(
                      `startingFundMeBalance : ${startingFundMeBalance}`
                  );
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `startingDeployerBalance : ${startingDeployerBalance}`
                  );
                  // Act
                  const txResponse = await fundMe.withdrawCheap();
                  const txReceipt = await txResponse.wait(1);
                  const gasCost = txReceipt.gasUsed.mul(
                      txReceipt.effectiveGasPrice
                  );
                  console.log(`gasCost : ${gasCost}`);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  console.log(`endingFundMeBalance : ${endingFundMeBalance}`);
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `endingDeployerBalance : ${endingDeployerBalance}`
                  );

                  // Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });
              it("allow us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  console.log(
                      `to fund contract by 5/${accounts.length} accounts`
                  );
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      );
                      const sendValueByAccount = sendValue.add(
                          ethers.utils.parseUnits(
                              (i * 10000000).toString(),
                              "gwei"
                          )
                      );
                      console.log(
                          `funded by ${i} with : ${sendValueByAccount}`
                      );
                      await fundMeConnectedContract.fund({
                          value: sendValueByAccount,
                      });
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);

                  console.log(
                      `startingFundMeBalance : ${startingFundMeBalance}`
                  );
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `startingDeployerBalance : ${startingDeployerBalance}`
                  );

                  // Act
                  const txResponse = await fundMe.withdrawCheap();
                  const txReceipt = await txResponse.wait(1);
                  const gasCost = txReceipt.gasUsed.mul(
                      txReceipt.effectiveGasPrice
                  );
                  console.log(`gasCost : ${gasCost}`);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  console.log(`endingFundMeBalance : ${endingFundMeBalance}`);
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  console.log(
                      `endingDeployerBalance : ${endingDeployerBalance}`
                  );

                  // Assert
                  assert.equal(endingFundMeBalance, 0);
                  assert.equal(
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          0,
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          )
                      );
                  }
              });
              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];

                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  );
                  await expect(
                      attackerConnectedContract.withdrawCheap()
                  ).to.be.revertedWith("FundMe__NotOwner");
              });
          });
      });
