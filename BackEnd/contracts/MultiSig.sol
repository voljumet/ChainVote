// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";

contract MultiSig is Storage{
    
    event caseApprovedE(uint256 caseNumber, string title);
    event confirmationE(bool confirmation);

    // Checks that only "Regional" or "National" userType can run the function
    function onlyOwners(uint256 _caseNumber) internal view returns(bool o){
        require(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("Regional")) ||
            keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("National")) , "ERR16");

        for(uint256 i = 0; i< _addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], _users[msg.sender]._stringUser["UserType"] )) ].length ; i++){
            if(_addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], _users[msg.sender]._stringUser["UserType"] )) ][i] == msg.sender){
                return true;
            }
        }
    }

    modifier superAdmin(){
        require(keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("SuperAdmin")) , "ERR27");
            _;
    }
        
    function approve(uint256 _caseNumber) public {
        require(onlyOwners(_caseNumber), "ERR21");
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR17");
        require(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == false, "ERR18");
        require(_cases[_caseNumber]._boolCase["OpenForVoting"] == false, "ERR19");

        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        _cases[_caseNumber]._uintCase["ApprovalsSigned"] = SafeMath.add(_cases[_caseNumber]._uintCase["ApprovalsSigned"], 1); // increase by 1
        
        // Over half approvals opens case for voting
        if(_cases[_caseNumber]._uintCase["ApprovalsSigned"] >= _cases[_caseNumber]._uintCase["ApprovalsNeeded"]){
            _cases[_caseNumber]._boolCase["OpenForVoting"] = true;
            clearFromWaiting(_caseNumber);
            emit caseApprovedE(_caseNumber, _cases[_caseNumber]._stringCase["Title"]);
        }
        assert(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == true);
        emit confirmationE(true);
    }

    // Removes caseNumber from the array "WaitingForApproval"
    function clearFromWaiting(uint256 _caseNumber) internal {
        for(uint256 i = 0; i < _uintArrayStorage["WaitingForApproval"].length; i++){
            if(_uintArrayStorage["WaitingForApproval"][i] == _caseNumber){
                _uintArrayStorage["WaitingForApproval"][i] = _uintArrayStorage["WaitingForApproval"][ SafeMath.sub(_uintArrayStorage["WaitingForApproval"].length, 1) ];
                _uintArrayStorage["WaitingForApproval"].pop();
            }
        }
    }
}