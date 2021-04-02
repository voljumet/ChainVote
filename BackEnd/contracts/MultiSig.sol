// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";

contract MultiSig is Storage{
    
    event ApprovalReceived(uint _caseNumber, uint _approvals, address _approver);
    event CaseApproved(uint _caseNumber);

    // Checks that only "Regional" or "National" userType can run the function
    modifier onlyOwners(uint _caseNumber){
        require(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("Regional")) ||
            keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("National")) , "ERR20");

        for(uint i = 0; i< _addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], checkUserTypeString())) ].length ; i++){
            if(_addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], checkUserTypeString())) ][i] == msg.sender){
                _;
            }
        }
    }

    // Used by modifier onlyOwners, and inside createCase to return "UserType"
    function checkUserTypeString() internal view returns(string memory ret){
        if(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("Regional"))){
            return "Regional";
        } else if(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("National"))){
            return "National";
        } 
    }
        
    function approve(uint _caseNumber) public onlyOwners(_caseNumber){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR16");
        require(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == false, "ERR21");
        require(_cases[_caseNumber]._boolCase["OpenForVoting"] == false, "ERR22");

        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        _cases[_caseNumber]._uintCase["Approvals"] = SafeMath.add(_cases[_caseNumber]._uintCase["Approvals"], 1); // increase by 1
        
        emit ApprovalReceived(_caseNumber, _cases[_caseNumber]._uintCase["Approvals"], msg.sender);
        
        // Over half approvals opens case for voting
        if(_cases[_caseNumber]._uintCase["Approvals"] >= _cases[_caseNumber]._uintCase["Limit"]){
            _cases[_caseNumber]._boolCase["OpenForVoting"] = true;
            clearFromWaiting(_caseNumber);
            emit CaseApproved(_caseNumber);
        }
        assert(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == true);
    }

    // Removes case number from the array "WaitingForApproval"
    function clearFromWaiting(uint _caseNumber) internal {
        for(uint i = 0; i < _uintArrayStorage["WaitingForApproval"].length; i++){
            if(_uintArrayStorage["WaitingForApproval"][i] == _caseNumber){
                _uintArrayStorage["WaitingForApproval"][i] = _uintArrayStorage["WaitingForApproval"][ SafeMath.sub(_uintArrayStorage["WaitingForApproval"].length, 1) ];
                _uintArrayStorage["WaitingForApproval"].pop();
            }
        }
    }


}