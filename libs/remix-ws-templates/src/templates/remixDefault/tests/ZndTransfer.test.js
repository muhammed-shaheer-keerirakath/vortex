/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const Web3 = require("web3");
const { expect } = require("chai");

describe("ZndTransfer", function () {
  let web3;
  let accounts;
  let zndTransferInstance;
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "receive",
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address",
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256",
        },
      ],
      "name": "ZndReceived",
      "type": "event",
    },
  ];

  before(async () => {
    // Initialize Web3 with a local provider
    web3 = new Web3("http://localhost:8545"); // Replace with your RPC URL

    // Get test accounts
    accounts = await web3.zond.getAccounts();

    // Deploy the contract using Web3.js
    const contractBytecode = "0x..."; // Replace with your compiled contract bytecode
    const deployTx = new web3.zond.Contract(contractABI)
      .deploy({ data: contractBytecode })
      .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: "30000000000", // Adjust gas price as needed
      });

    zndTransferInstance = await deployTx;
  });

  it("should deploy the contract", async () => {
    expect(zndTransferInstance.options.address).to.be.a("string");
    expect(web3.utils.isAddress(zndTransferInstance.options.address)).to.be.true;
  });

  it("should accept ZND (ETH) transfers and emit an event", async () => {
    const sender = accounts[1];
    const sendValue = web3.utils.toWei("1.0", "ether"); // Send 1 ZND (ETH)

    // Send ZND (ETH) to the contract
    const receipt = await web3.zond.sendTransaction({
      from: sender,
      to: zndTransferInstance.options.address,
      value: sendValue,
    });

    // Verify event emission
    const event = receipt.logs.find(
      (log) => log.topics[0] === web3.utils.keccak256("ZndReceived(address,uint256)")
    );
    expect(event).to.not.be.undefined;

    const decodedEvent = web3.zond.abi.decodeLog(
      [
        { indexed: true, type: "address", name: "from" },
        { indexed: false, type: "uint256", name: "amount" },
      ],
      event.data,
      event.topics.slice(1)
    );

    expect(decodedEvent.from).to.equal(sender);
    expect(decodedEvent.amount).to.equal(sendValue);

    // Verify contract balance
    const contractBalance = await zndTransferInstance.methods.getBalance().call();
    expect(contractBalance).to.equal(sendValue);
  });

  it("should accurately report the contract's ZND balance", async () => {
    const additionalValue = web3.utils.toWei("0.5", "ether"); // Add 0.5 ZND
    await web3.zond.sendTransaction({
      from: accounts[2],
      to: zndTransferInstance.options.address,
      value: additionalValue,
    });

    const contractBalance = await zndTransferInstance.methods.getBalance().call();
    expect(contractBalance).to.equal(web3.utils.toWei("1.5", "ether")); // Total balance
  });
});
