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
        require(signer == true, "ERR5: Signer = true");
        _;
    }
    
    // Checks if userType is Regional or National, returns either, returns nothing if userType is Standard
    function checkUserTypeString() internal view returns(string memory returnVal) {
        require(checkUserTypeBool(), "ERR3: checkUserTypeBool");
        if(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("Regional"))){
            return ("Regional");
        } else if(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("National"))){
            return ("National");
        } 
    }
    
    function checkUserTypeBool() internal view returns(bool returnVal) {
        require(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("Regional")) ||
                keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("National")),  "ERR4: Require Reg OR Nat");
        return true;
    }

    // Create an instance of the Sign struct and add it to the SigningRequests array
    function publishForApproval(uint _caseNumber) internal onlyOwners(_caseNumber) {
        _cases[_caseNumber]._uintCase["Approvals"] = 0;
        // legges til i lista
        _uintArrayStorage["WaitingForApproval"].push(_caseNumber);
        
        emit SigningRequestCreated(_cases[_caseNumber]._stringCase["Title"], _caseNumber);
    }
    
    // APPROVE NOT WORKING
    function approve(uint _caseNumber) internal onlyOwners(_caseNumber) {
        require(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == false, "ERR12: msg.sender = false");  // checks if user has approved
        require(_cases[_caseNumber]._boolCase["Open For Voting"] == false, "ERR13: open = false X");                     // checks if case is approved

        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        //SafeMath.add(_cases[_caseNumber]._uintCase["Approvals"], 1); // increase by 1
        _cases[_caseNumber]._uintCase["Approvals"]+=1; // increase by 1
        
        emit ApprovalReceived(_caseNumber, _cases[_caseNumber]._uintCase["Approvals"], msg.sender);
        
        if(_cases[_caseNumber]._uintCase["Approvals"] >= _cases[_caseNumber]._uintCase["Limit"]){
            //When enough signatures are received, will open the case for voting. Change "OpenforVoting" bool to true. 
            _cases[_caseNumber]._boolCase["Open For Voting"] = true;
            // fjernes fra waiting lista
            
            emit CaseApproved(_caseNumber);
        }
        assert(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == true);
    }
    
    function getSigningRequests(uint _caseNumber) internal view returns(string memory, uint) {
        uint number = (_cases[_caseNumber]._uintCase["Approvals"]*100);
        uint number2 = (_cases[_caseNumber]._uintCase["Total Votes"]*100);
        uint number3 = number/number2;
        
        return ("Percent signed(%): ", number3);
    }

    function getApproval(uint _caseNumber) public view returns(uint){
        return _cases[_caseNumber]._uintCase["Approvals"];
    }
}