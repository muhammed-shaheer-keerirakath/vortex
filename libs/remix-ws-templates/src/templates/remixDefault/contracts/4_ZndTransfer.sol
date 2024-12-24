// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ZndTransfer {
    // Event to log Znd transfers
    event ZndSent(address indexed to, uint256 amount);
    event ZndReceived(address indexed from, uint256 amount);

    // Function to receive Znd directly into the contract
    receive() external payable {
        emit ZndReceived(msg.sender, msg.value);
    }

    // Function to view the contract's Znd balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to send Znd to a specific address
    function sendZnd(address payable recipient, uint256 amount) public {
        require(
            address(this).balance >= amount,
            "Not enough Znd in the contract"
        );
        recipient.transfer(amount);
        emit ZndSent(recipient, amount);
    }
}
