/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZndAmount", function () {
  it("test initial value", async function () {
    const ZndAmount = await ethers.getContractFactory("ZndAmount");
    const zndAmount = await ZndAmount.deploy();
    await zndAmount.deployed();
    console.log("ZndAmount deployed at:" + zndAmount.address);
    expect((await zndAmount.getAmount()).toNumber()).to.equal(0);
  });

  it("test updating and retrieving updated value", async function () {
    const ZndAmount = await ethers.getContractFactory("ZndAmount");
    const zndAmount = await ZndAmount.deploy();
    await zndAmount.deployed();
    const ZndAmount2 = await ethers.getContractAt("ZndAmount", zndAmount.address);
    const setAmount = await ZndAmount2.setAmount(56);
    await setAmount.wait();
    expect((await ZndAmount2.getAmount()).toNumber()).to.equal(56);
  });
});
