// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";

contract MultiSig is Storage{
    
    event caseApprovedE(uint caseNumber, string title);
    event confirmationE(string confirmation);

    // Checks that only "Admin" or "SuperAdmin" userType can run the function
    modifier onlyOwners(uint _caseNumber){
        require(keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("Admin")) ||
            keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("SuperAdmin")) , "ERR16");

        for(uint i = 0; i< _addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], _users[msg.sender]._stringUser["UserType"] )) ].length ; i++){
            if(_addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], _users[msg.sender]._stringUser["UserType"] )) ][i] == msg.sender){
                _;
            }
        }
    }

    modifier superAdmin(){
        require(keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("SuperAdmin")) , "ERR21");
            _;
    }
        
    function approve(uint _caseNumber) public onlyOwners(_caseNumber){

        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0 && _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == false && _cases[_caseNumber]._boolCase["OpenForVoting"] == false, "ERR17-19");
        

        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        _cases[_caseNumber]._uintCase["Approvals"] = SafeMath.add(_cases[_caseNumber]._uintCase["Approvals"], 1); // increase by 1
        
        // Over half approvals opens case for voting
        if(_cases[_caseNumber]._uintCase["Approvals"] >= _cases[_caseNumber]._uintCase["Limit"]){
            _cases[_caseNumber]._boolCase["OpenForVoting"] = true;
            clearFromWaiting(_caseNumber);
            emit caseApprovedE(_caseNumber, _cases[_caseNumber]._stringCase["Title"]);
        }
        assert(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == true);
        emit confirmationE("Your approval has been recieved");
    }

    // Removes caseNumber from the array "WaitingForApproval"
    function clearFromWaiting(uint _caseNumber) internal {
        for(uint i = 0; i < _uintArrayStorage["WaitingForApproval"].length; i++){
            if(_uintArrayStorage["WaitingForApproval"][i] == _caseNumber){
                _uintArrayStorage["WaitingForApproval"][i] = _uintArrayStorage["WaitingForApproval"][ SafeMath.sub(_uintArrayStorage["WaitingForApproval"].length, 1) ];
                _uintArrayStorage["WaitingForApproval"].pop();
            }
        }
    }
}