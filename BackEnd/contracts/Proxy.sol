//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "./Ownable.sol";

contract Proxy is Ownable {

    constructor(address _currenAddress) {
        // index 0, not sure if ok
        _addressStorage[0]["currentAddress"] = _currenAddress;
        _boolStorage[0]["paused"] = false;
    }

    function upgrade(address _newAddress) public onlyOwner whenPaused {
        _addressStorage[0]["currentAddress"] = _newAddress;
    }

    modifier whenNotPaused() {
        require(!_boolStorage[0]["paused"]);
        _;
    }
    modifier whenPaused() {
        require(_boolStorage[0]["paused"]);
        _;
    }
    
    function pause() public onlyOwner whenNotPaused {
        _boolStorage[0]["paused"] = true;
    }
    
    function unPause() public onlyOwner whenPaused{
        _boolStorage[0]["paused"] = false;
    }

    // Fallback function, last call..
    fallback() payable external whenNotPaused {
        address implementation = _addressStorage[0]["currentAddress"];
        require(_addressStorage[0]["currentAddress"] != address(0));
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

