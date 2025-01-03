// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZndAmount {
    // State variable to store the amount of ZND
    uint256 private zndAmount;

    // Function to set the amount of ZND
    function setAmount(uint256 _amount) public {
        zndAmount = _amount;
    }

    // Function to get the current amount of ZND
    function getAmount() public view returns (uint256) {
        return zndAmount;
    }
}
