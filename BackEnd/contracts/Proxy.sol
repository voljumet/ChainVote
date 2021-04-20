// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "./MultiSig.sol";

contract Proxy is MultiSig {

    constructor(address[] memory _superAdminArray, string memory _region) {
        require(!_boolStorage["initialized"], "ERR1");
        require(_superAdminArray.length % 2 != 0, "ERR34");

        _uintStorage["ApprovalsNeeded"] = 0;
        _boolStorage["InstanceInProgress"] = true;
        _boolStorage["paused"] = true;
        for(uint i = 0; i < _superAdminArray.length; i++){
            _users[_superAdminArray[i]]._stringUser["UserType"] = "SuperAdmin";
            _users[_superAdminArray[i]]._boolUser["Init"] = true;
            _users[_superAdminArray[i]]._stringUser["Region"] = _region;
            _addressArrayStorage["SuperAdmin"].push(_superAdminArray[i]);
            _addressArrayStorage[ string(abi.encodePacked(_region,"SuperAdmin")) ].push(_superAdminArray[i]);
        }
        

        assert( bytes32(keccak256(abi.encodePacked(
                     _users[msg.sender]._stringUser["UserType"],
                   _boolStorage["paused"])))
            ==
                bytes32(keccak256(abi.encodePacked(
                    "SuperAdmin",
                    true)))
        );
    }

    function upgrade(address _newAddress) public whenPaused {
        require(onlyOwners());
        if(!_boolStorage["InstanceInProgress"]){
            _boolStorage["UpgradeStarted"] = true;
            createMultisigInstance();
            _addressStorage["functionContractAddressUpgrade"] = _newAddress;
        }
    }

    modifier whenNotPaused() {
        require(!_boolStorage["paused"], "ERR24");
        _;
    }

    modifier whenPaused() {
        require(_boolStorage["paused"], "ERR25");
        _;
    }
    
    function pause() public whenNotPaused {
        require(onlyOwners());
        if(!_boolStorage["InstanceInProgress"]){
            _boolStorage["PauseStarted"] = true;
            createMultisigInstance();
        }
    }
    
    function unPause() public whenPaused {
        require(onlyOwners());
        if(_boolStorage["initialized"] && _uintStorage["pauseTimer"] < block.timestamp){
            _boolStorage["paused"] = false;
            emit confirmationE(true);
        } else {
            // will be unpaused if contract is not initialized yet
            _boolStorage["paused"] = false;
            _boolStorage["initialized"] = true;
        }
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

