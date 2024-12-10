// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "remix_tests.sol"; // this import is automatically injected by Remix.
import "hardhat/console.sol";
import "../contracts/3_MyToken.sol";

contract MyTokenTest {
    MyToken private token;

    constructor() {
        // Deploy the MyToken contract
        token = new MyToken("MyToken", "MTK");
    }

    // Test: Initial supply is correctly minted to the deployer
    function testInitialSupply() public view returns (bool) {
        uint256 expectedSupply = 100 * 10**token.decimals();
        return token.balanceOf(address(this)) == expectedSupply;
    }

    // Test: Token name and symbol are correct
    function testNameAndSymbol() public view returns (bool) {
        return
            keccak256(bytes(token.name())) == keccak256(bytes("MyToken")) &&
            keccak256(bytes(token.symbol())) == keccak256(bytes("MTK"));
    }

    // Test: Transfer tokens to another account
    function testTokenTransfer() public returns (bool) {
        address recipient = address(0x123);
        uint256 transferAmount = 10 * 10**token.decimals();

        token.transfer(recipient, transferAmount);

        bool recipientHasTokens = token.balanceOf(recipient) == transferAmount;
        bool senderBalanceCorrect = token.balanceOf(address(this)) ==
            (100 * 10**token.decimals()) - transferAmount;

        return recipientHasTokens && senderBalanceCorrect;
    }

    // Test: Minting by the owner
    function testMintByOwner() public returns (bool) {
        uint256 mintAmount = 50 * 10**token.decimals();
        token.mint(mintAmount);

        uint256 expectedSupply = (100 + 50) * 10**token.decimals();
        return token.totalSupply() == expectedSupply;
    }
}
