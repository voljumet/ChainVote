//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./Storage.sol";

/**
 * This contract is made partly from the openzeppelin
 *
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
 
contract Ownable is Storage {

    modifier onlyOwner(){
        require(msg.sender == _addressStorage["owner"]);
        _; //Continue execution
    }

    constructor() {
        _addressStorage["owner"] = msg.sender;
    }
}