// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";

contract MultiSig is Storage{

    event caseApprovedE(uint256 caseNumber, string title);
    event confirmationE(bool confirmation);

    //SuperAdmin modifier ensures that a function is run only if it is called by a user in the superadmin array. Meaning a user has to be a superAdmin in order to run a functin with this modifier. 
    function onlyOwners() internal view returns(bool o){
        require(keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("SuperAdmin")) , "ERR27");
        return true;
    }

    function createMultisigInstance() internal {
        require(onlyOwners());
        _uintStorage["MultisigInstance"]++;
        
        _uintStorage["ApprovalsNeeded"] = (_addressArrayStorage["SuperAdmin"].length + 1) /2;
        _uintStorage[string(abi.encodePacked(_uintStorage["MultisigInstance"]))] = _uintStorage["ApprovalsNeeded"];
        _boolStorage[string(abi.encodePacked(msg.sender, _uintStorage["MultisigInstance"]))] = true;
        _boolStorage["InstanceInProgress"] = true;
        _uintStorage["ApprovalsNeeded"] -= 1;
        emit caseApprovedE(_uintStorage["ApprovalsNeeded"], "New pause, Unpause or Upgrade request");
    }

    function signMultisigInstance() public {
        require(onlyOwners());
        require(!_boolStorage[string(abi.encodePacked(msg.sender, _uintStorage["MultisigInstance"]))], "ERR37");
        _boolStorage[string(abi.encodePacked(msg.sender, _uintStorage["MultisigInstance"]))] = true;
        _uintStorage["ApprovalsNeeded"] -= 1;

        if(_uintStorage["ApprovalsNeeded"] == 0){
            if(_boolStorage["UpgradeStarted"]){
                _addressStorage["functionContractAddress"] = _addressStorage["functionContractAddressUpgrade"];
                _boolStorage["UpgradeStarted"] = false;
            } else if (_boolStorage["PauseStarted"]){
                _boolStorage["paused"] = true;
                _uintStorage["pauseTimer"] = (block.timestamp) + 2; //604800; //uncomment number for 7 days.
                _boolStorage["PauseStarted"] = false;
            }
            _boolStorage["InstanceInProgress"] = false;
            emit confirmationE(true);
        }
        emit caseApprovedE(_uintStorage["ApprovalsNeeded"], "Signed request");
    }
}