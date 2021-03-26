pragma solidity 0.7.5;
pragma abicoder v2;

import "./Storage.sol";

contract MultiSig is Storage{
    
    event SigningRequestCreated(string title,uint _caseNumber);
    event ApprovalReceived(uint _caseNumber, uint _approvals, address _approver);
    event CaseApproved(uint _caseNumber);

    //Should only allow people in the signers list to continue the execution.
    modifier onlyOwners(uint _caseNumber){
        bool signer = false;
        string memory temp = "Standard";
        require(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("Regional")) || keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("National")));
        if(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("Regional"))){
            temp = "Regional";
        } else if(keccak256(bytes(_users[msg.sender]._stringUser["User Type"])) == keccak256(bytes("National"))){
            temp = "National";
        } 
        
        for(uint i = 0; i< _addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"],temp)) ].length ; i++){
            if(_addressArrayStorage[ string(abi.encodePacked(_cases[_caseNumber]._stringCase["Region"],temp)) ][i] == msg.sender){
                signer = true;
            }
        }
        require(signer == true);
        _;
    }

    // Create an instance of the Sign struct and add it to the SigningRequests array
    function publishForApproval(uint _caseNumber) internal onlyOwners(_caseNumber) {
        _cases[_caseNumber]._uintCase["Approvals"] = 0;
        _cases[_caseNumber]._boolCase["hasBeenApproved"] = false;
        // legges til i lista
        _uintArrayStorage["WaitingForApproval"].push(_caseNumber);
        
        emit SigningRequestCreated(_cases[_caseNumber]._stringCase["Title"], _caseNumber);
    }
    
    function approve(uint _caseNumber) internal onlyOwners(_caseNumber) {
        require(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] == false);  // checks if user has approved
        require(_cases[_caseNumber]._boolCase["hasBeenApproved"] == false);                     // checks if case is approved
        
        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // user has approved
        _cases[_caseNumber]._uintCase["Approvals"] ++;
        
        emit ApprovalReceived(_caseNumber, _cases[_caseNumber]._uintCase["Approvals"], msg.sender);
        
        if(_cases[_caseNumber]._uintCase["Approvals"] >= _cases[_caseNumber]._uintCase["Limit"]){
            _cases[_caseNumber]._boolCase["hasBeenApproved"] = true;
            // fjernes fra waiting lista
            //When enough signatures are received, will open the case for voting. Change "OpenforVoting" bool to true. 
            
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
}