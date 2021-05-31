// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Box {
    string private value;

    // Emitted when the stored value changes
    event ValueChanged(string newValue);

    // Stores a new value in the contract
    function update(string memory newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function get() public view returns (string memory) {
        return value;
    }
}