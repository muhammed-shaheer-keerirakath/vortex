VORTEX DEFAULT WORKSPACE

Vortex default workspace is present when:
i. Vortex IDE loads for the very first time 
ii. A new workspace is created with 'Default' template
iii. There are no files existing in the File Explorer

This workspace contains 3 directories:

1. 'contracts': Contains the MyToken contract which mints a token.
2. 'scripts': Contains a typescript file for deploying a contract. It is explained below.
3. 'tests': Contains one Solidity test file for 'MyToken' contract & one JS test file for 'Storage' contract.

SCRIPTS

The 'scripts' folder has a typescript file which help to deploy the 'MyToken' contract using 'web3.js' library.

For the deployment of any other contract, just update the contract's name from 'Storage' to the desired contract and provide constructor arguments accordingly 
in the file `deploy_with_ethers.ts` or  `deploy_with_web3.ts`

In the 'tests' folder there is a script containing Mocha-Chai unit tests for 'Storage' contract.

To run a script, right click on file name in the file explorer and click 'Run'. Remember, Solidity file must already be compiled.
Output from script will appear in vortex terminal.

Please note, require/import is supported in a limited manner for Vortex supported modules.
For now, modules supported by Vortex are QRL web3, swarmgw, chai, multihashes, remix and hardhat only for hardhat.ethers object/plugin.
For unsupported modules, an error like this will be thrown: '<module_name> module require is not supported by Vortex IDE' will be shown.
