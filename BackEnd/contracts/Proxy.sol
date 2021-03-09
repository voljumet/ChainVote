pragma solidity 0.7.5;

import "./Storage.sol";
import "./Ownable.sol";

contract Proxy is Storage, Ownable{

    address currentAddress;
    bool private _paused;

    constructor(address _currenAddress) {
        currentAddress = _currenAddress;
        _paused = false;
    }

    function upgrade(address _newAddress) public onlyOwner whenPaused {
        currentAddress = _newAddress;
    }

    modifier whenNotPaused() {
        require(!_paused);
        _;
    }
    modifier whenPaused() {
        require(_paused);
        _;
    }
    
    function pause() public onlyOwner whenNotPaused {
        _paused = true;
    }
    
    function unPause() public onlyOwner whenPaused{
        _paused = false;
    }

// Fallback function, last call..
    fallback() external payable whenNotPaused {
        address implementation = currentAddress;
        require(currentAddress != address(0));
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
}

