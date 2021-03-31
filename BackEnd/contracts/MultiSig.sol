//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";

contract MultiSig is Storage{
    
    event SigningRequestCreated(string title,uint _caseNumber);
    event ApprovalReceived(uint _caseNumber, uint _approvals, address _approver);
    event CaseApproved(uint _caseNumber);

    // Checks that only "Regional" or "National" userType can run the function
    modifier onlyOwners(uint _caseNumber){
        bool signer = false;
        
        for(uint i = 0; i< _addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"], checkUserTypeString())) ].length ; i++){
            if(_addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"],checkUserTypeString())) ][i] == msg.sender){
                signer = true;
            }
        }
        require(signer == true, "multisig.error.5: Signer = true");
        _;
    }
    
    // Checks if userType is Regional or National, returns either, reverts if userType is Standard
    function checkUserTypeString() internal view returns(string memory returnVal) {
        require(checkUserTypeBool(), "multisig.error.3: checkUserTypeBool");
        if(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("Regional"))){
            return ("Regional");
        } else if(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("National"))){
            return ("National");
        } 
    }
    
    // checks if user is Regional or National, returns bool
    function checkUserTypeBool() internal view returns(bool returnVal) {
        require(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("Regional")) ||
                keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("National")),  
                "multisig.error.4: Require Reg OR Nat");
        return true;
    }

    // Create an instance of the Sign struct and add it to the SigningRequests array
    function publishForApproval(uint _caseNumber) internal onlyOwners(_caseNumber) {
        _cases[_caseNumber]._uintCase["Approvals"] = 0;                 // Initialize approvals
        _uintArrayStorage["Waiting For Approval"].push(_caseNumber);    // Add to waiting list

        emit SigningRequestCreated(_cases[_caseNumber]._stringCase["Title"], _caseNumber);
    }
    
    function approve(uint _caseNumber) internal onlyOwners(_caseNumber){
        require(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == false, "ERR12: This address has already approved this case");
        require(_cases[_caseNumber]._boolCase["Open For Voting"] == false, "multisig.error.13: Case open for voting, cant be approved");

        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        _cases[_caseNumber]._uintCase["Approvals"] = SafeMath.add(_cases[_caseNumber]._uintCase["Approvals"], 1); // increase by 1
        
        emit ApprovalReceived(_caseNumber, _cases[_caseNumber]._uintCase["Approvals"], msg.sender);
        
        // Over half approvals opens case for voting
        if(_cases[_caseNumber]._uintCase["Approvals"] >= _cases[_caseNumber]._uintCase["Limit"]){
            _cases[_caseNumber]._boolCase["Open For Voting"] = true;
            clearFromWaiting(_caseNumber);
            emit CaseApproved(_caseNumber);
        }
        assert(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == true);
    }

    // Removes case number from the array "Waiting For Approval"
    function clearFromWaiting(uint _caseNumber) internal {
        for(uint i = 0; i < _uintArrayStorage["Waiting For Approval"].length; i++){
            if(_uintArrayStorage["Waiting For Approval"][i] == _caseNumber){
                _uintArrayStorage["Waiting For Approval"][i] = _uintArrayStorage["Waiting For Approval"][ SafeMath.sub(_uintArrayStorage["Waiting For Approval"].length, 1) ];
                _uintArrayStorage["Waiting For Approval"].pop();
            }
        }
    }

    function getApprovals(uint _caseNumber) internal view returns(uint) {
        return _cases[_caseNumber]._uintCase["Approvals"];
    }

    function getLimit(uint _caseNumber) internal view returns(uint){
        return _cases[_caseNumber]._uintCase["Limit"];
    }

}