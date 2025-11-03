// This script can be used to deploy the "MyToken" contract using Web3 library.
// Please make sure to compile "./contracts/MyToken.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy } from "./web3_lib";

(async () => {
  try {
    const result = await deploy("MyToken", []);
    console.log(`Result: ${result}`);
  } catch (e) {
    console.log(e.message);
  }
})();
