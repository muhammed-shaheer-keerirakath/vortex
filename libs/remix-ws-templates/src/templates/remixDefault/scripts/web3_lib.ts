import { Web3 } from "@theqrl/web3";

const config = {
  provider: "http://localhost:8545",
  hexseed: "hexseed_here",
  contract_address: "contract_address_here",
  tx_required_confirmations: 12,
};

export const deploy = async (
  contractName: string,
  args: Array<any>,
  from?: string,
  gas?: number
) => {
  if (config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.");
    return;
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
  const account = web3.zond.accounts.seedToAccount(config.hexseed);
  web3.zond.wallet?.add(config.hexseed);
  web3.zond.transactionConfirmationBlocks = config.tx_required_confirmations;

  console.log(
    `Attempting to deploy ${contractName} contract from account ${account.address}`
  );
  // Note that the script needs the ABI which is generated from the compilation artifact.
  // Make sure contract is compiled and artifacts are generated
  const artifactsPath = `browser/contracts/artifacts/${contractName}.json`;
  const metadata = JSON.parse(
    await remix.call("fileManager", "getFile", artifactsPath)
  );

  const contractABI = metadata.abi;
  const contractByteCode = metadata.data.bytecode.object;
  const contract = new web3.zond.Contract(contractABI);

  const deployOptions = {
    data: contractByteCode,
    arguments: ["TOKEN123", "TOK"],
  };
  const contractDeploy = contract.deploy(deployOptions as any);
  const estimatedGas = await contractDeploy.estimateGas({
    from: account.address,
  });
  const txObj = {
    type: "0x2",
    gas: estimatedGas,
    from: account.address,
    data: contractDeploy.encodeABI(),
  };

  await web3.zond
    .sendTransaction(txObj, undefined, { checkRevertBeforeSending: false })
    .on("confirmation", console.log)
    .on("receipt", receiptHandler)
    .on("error", console.error);
};

const receiptHandler = function (receipt) {
  console.log("Contract address ", receipt.contractAddress);
};
