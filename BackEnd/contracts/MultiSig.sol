// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";
import "../../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract MultiSig is Storage{
    
    using SafeMath for uint256;

    event caseApprovedE(uint256 caseNumber, string title);
    event confirmationE(bool confirmation);

    // Checks that only "Admin" or "SuperAdmin" userType can run the function
    function onlyOwners(uint256 _caseNumber) internal view returns(bool o){
        require(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("Admin")) ||
            keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("SuperAdmin")) , "ERR16");

        for(uint256 i = 0; i< _addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], _users[msg.sender]._stringUser["UserType"] )) ].length ; i++){
            if(_addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], _users[msg.sender]._stringUser["UserType"] )) ][i] == msg.sender){
                return true;
            }
        }
    }

    //SuperAdmin modifier ensures that a function is run only if it is called by a user in the superadmin array. Meaning a user has to be a superAdmin in order to run a functin with this modifier. 
    modifier superAdmin(){
        require(keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("SuperAdmin")) , "ERR27");
            _;
    }
        
    function approve(uint256 _caseNumber) public {
        require(onlyOwners(_caseNumber), "ERR21");
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR17");
        require(!_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))], "ERR18");
        require(!_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR19");

        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        _cases[_caseNumber]._uintCase["ApprovalsSigned"] = _cases[_caseNumber]._uintCase["ApprovalsSigned"].add(1); // increase by 1
        
        // Over half approvals opens case for voting
        if(_cases[_caseNumber]._uintCase["ApprovalsSigned"] >= _cases[_caseNumber]._uintCase["ApprovalsNeeded"]){
            _cases[_caseNumber]._boolCase["OpenForVoting"] = true;
            clearFromWaiting(_caseNumber);
            emit caseApprovedE(_caseNumber, _cases[_caseNumber]._stringCase["Title"]);
        }
        assert(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]);
        emit confirmationE(true);
    }

    function createMultisigInstance()public superAdmin {
        _uintStorage["multisigInstance"] = _uintStorage["multisigInstance"].add(1); 
        
        _uintStorage["neededApprovals"] = _addressArrayStorage["superAdmins"].length.sub(1).div(2);
        _uintStorage[string(abi.encodePacked(_uintStorage["multisigInstance"]))] = _uintStorage["neededApprovals"];
        _boolStorage[string(abi.encodePacked(msg.sender, _uintStorage["multisigInstance"]))] = true;
        _boolStorage["instanceInProgress"] = true;

        emit caseApprovedE(_uintStorage["multisigInstance"], "New pause, unpause or upgrade request");
    }

    function signMultisigInstance() public superAdmin{
        require(!_boolStorage[string(abi.encodePacked(msg.sender, _uintStorage["multisigInstance"]))]);
        _boolStorage[string(abi.encodePacked(msg.sender, _uintStorage["multisigInstance"]))] = true;
        _uintStorage["neededApprovals"] = _uintStorage["neededApprovals"].sub(1);

        emit caseApprovedE(_uintStorage["neededApprovals"], "signed request");
    }

    // Removes caseNumber from the array "WaitingForApproval"
    function clearFromWaiting(uint256 _caseNumber) internal {
        for(uint256 i = 0; i < _uintArrayStorage["WaitingForApproval"].length; i++){
            if(_uintArrayStorage["WaitingForApproval"][i] == _caseNumber){
                _uintArrayStorage["WaitingForApproval"][i] = _uintArrayStorage["WaitingForApproval"][ _uintArrayStorage["WaitingForApproval"].length.sub(1) ];
                _uintArrayStorage["WaitingForApproval"].pop();
            }
        }
    }
}