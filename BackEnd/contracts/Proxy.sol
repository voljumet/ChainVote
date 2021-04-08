// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "./Ownable.sol";

contract Proxy is Ownable {

    constructor(address _currenAddress) {
        _addressStorage["functionContractAddress"] = _currenAddress;
        _boolStorage["paused"] = false;
    }

    function upgrade(address _newAddress) public onlyOwner whenPaused {
        _addressStorage["functionContractAddress"] = _newAddress;
    }

    modifier whenNotPaused() {
        require(!_boolStorage["paused"], "ERR24");
        _;
    }
    modifier whenPaused() {
        require(_boolStorage["paused"], "ERR25");
        _;
    }
    
    function pause() public onlyOwner whenNotPaused {
        _boolStorage["paused"] = true;
    }
    
    function unPause() public onlyOwner whenPaused{
        _boolStorage["paused"] = false;
    }

    // Fallback function, last call..
    fallback() payable external whenNotPaused {
        address implementation = _addressStorage["functionContractAddress"];
        // checks that address(0) is not an empty address
        require(_addressStorage["functionContractAddress"] != address(0), "ERR26");
        bytes memory data = msg.data;

        assembly{
            let result := delegatecall(gas(), implementation, add(data, 0x20), mload(data), 0, 0)
            let size := returndatasize()
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return(ptr, size)}
        }
    }
    // Solidity split the unnamed function into fallback() and recieve() in v 0.6.0
    receive() external payable {
        // custom function code
    }
}

