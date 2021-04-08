// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;


import "./MultiSig.sol";

contract Proxy is MultiSig {

    constructor(address[] memory _superAdminArray) {
        require(!_boolStorage["initialized"], "ERR1");
        // index 0, not sure if ok
        _boolStorage["paused"] = false;
        for(uint i = 0; i < _superAdminArray.length; i++){
            _users[_superAdminArray[i]]._stringUser["UserType"] = "SuperAdmin";
            _addressArrayStorage["superAdmins"].push(_superAdminArray[i]);
        }
        
         _users[msg.sender]._stringUser["UserType"] = "SuperAdmin";
        _boolStorage["initialized"] = true;

        assert( keccak256(abi.encodePacked(
                     _users[msg.sender]._stringUser["UserType"],
                   _boolStorage["initialized"]))
            ==
                keccak256(abi.encodePacked(
                    "SuperAdmin",
                    true))
        );
    }

    function upgrade(address _newAddress) public superAdmin whenPaused {
        if(!_boolStorage["instanceInProgress"]){
            createMultisigInstance();
        }
        if(_uintStorage["neededApprovals"] == 0){
            _addressStorage["functionContractAddress"] = _newAddress;
            _boolStorage["instanceInProgress"] = false;
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
    
    function pause() public superAdmin whenNotPaused {
        if(!_boolStorage["instanceInProgress"]){
            createMultisigInstance();
        }
        if(_uintStorage["neededApprovals"] == 0){
            _boolStorage["paused"] = true;
            _boolStorage["instanceInProgress"] = false;
            _uintStorage["pauseTimer"] = SafeMath.add(block.timestamp, 604800);
         }
    }
    
    function unPause() public superAdmin whenPaused{
        require(_uintStorage["pauseTimer"] < block.timestamp);
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

