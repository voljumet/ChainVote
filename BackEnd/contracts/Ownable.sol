//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./Storage.sol";

contract Ownable is Storage {

    modifier onlyOwner(){
        require(msg.sender == _addressStorage[0]["owner"]);
        _; //Continue execution
    }

    constructor() {
        _addressStorage[0]["owner"] = msg.sender;
    }
}