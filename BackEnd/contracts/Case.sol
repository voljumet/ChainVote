//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Ownable.sol";
import "./MultiSig.sol";

contract Case is Ownable, MultiSig {

    constructor() {
        initialize(msg.sender);
    }
    
     function createUser(string memory _region, string memory _userType) public {
        require(keccak256( abi.encodePacked(_users[msg.sender]._stringUser["Region"]))== keccak256(""), "case.error.1: User is already registered");
        require(keccak256( abi.encodePacked(_users[msg.sender]._stringUser["User Type"]))== keccak256(""), "case.error.1: User is already registered");
        _users[msg.sender]._stringUser["Region"] = _region;
        _users[msg.sender]._stringUser["User Type"] = _userType;

        uint  length =  _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
        _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].push(msg.sender); // makes array based on region and usertype

        assert(keccak256(abi.encodePacked(
                    _users[msg.sender]._stringUser["Region"],
                    _users[msg.sender]._stringUser["User Type"],
                     _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length
                ))
            ==
            keccak256(abi.encodePacked(
                    _region,
                    _userType,
                    length+=1     
                ))
        );
    }

    function editUser(string memory _Region, string memory _userType) public{

        if(keccak256((abi.encodePacked(_Region))) != keccak256((abi.encodePacked(_users[msg.sender]._stringUser["Region"])))){
            _users[msg.sender]._stringUser["Region"] = _Region;      
        }
        if(keccak256((abi.encodePacked(_userType))) != keccak256((abi.encodePacked(_users[msg.sender]._stringUser["User Type"])))){
            _users[msg.sender]._stringUser["User Type"] = _userType;
        }
        assert(keccak256((abi.encodePacked(_Region))) == keccak256((abi.encodePacked(_users[msg.sender]._stringUser["Region"]))) &&
               keccak256((abi.encodePacked(_userType))) == keccak256((abi.encodePacked(_users[msg.sender]._stringUser["User Type"]))));
    }
    
    
    
    function initialize(address _owner) private {
        require(!_boolStorage["initialized"], "case.error.3: initialized");
        _addressStorage["owner"] = _owner;
        _boolStorage["initialized"] = true;

        assert( keccak256(abi.encodePacked(
                     _addressStorage["owner"],
                   _boolStorage["initialized"]))
            ==
                keccak256(abi.encodePacked(
                    _owner,
                    true))
        );
    }

    event caseCreated(string title, bool openForVoting);
    event caseDeleted(string title, bool openForVoting);
    event votingOpened(uint256 caseNumber, string title);
    event votingClosed(uint256 caseNumber, string title);
    event CloseVoting(string); // Result needed
    
    function endVoting(uint _caseNumber)public onlyOwners(_caseNumber){
        require(_cases[_caseNumber]._uintCase["Close"] < block.timestamp, "case.error.21: Voting for case not ended");
        _cases[_caseNumber]._boolCase["open For Voting"] = false; 
        assert(_cases[_caseNumber]._boolCase["open For Voting"] = false);
        emit CloseVoting(_cases[_caseNumber]._stringCase["Title"]);
    }

    function limit(uint _caseNumber, string memory _region) private {
        _cases[_caseNumber]._uintCase["Limit"] = 
        SafeMath.div(
            SafeMath.add(
                SafeMath.div(
                    SafeMath.mul(
                        _addressArrayStorage[ string(abi.encodePacked(_region,checkUserTypeString())) ].length, 
                    10),
                2),
            5),
        10);
    }

    function totalVotes(uint _caseNumber, string memory _region) private{
        _cases[_caseNumber]._uintCase["Total Votes"] = 
            SafeMath.add(_addressArrayStorage[ string(abi.encodePacked(_region,"National")) ].length, 
                SafeMath.add(_addressArrayStorage[ string(abi.encodePacked(_region,"Standard")) ].length, 
                                _addressArrayStorage[ string(abi.encodePacked(_region,"Regional")) ].length));

    }

    function createCase(string memory _title, string memory _description, uint256 _open, uint256 _close, string[] memory _alternatives) public {
        require(checkUserTypeBool(),"case.error.1: Not Regional or National"); // checks that the userType is "Regional" or "National"
        _uintStorage["caseNumber"] = SafeMath.add(_uintStorage["caseNumber"], 1); // "Global" Case Number Counter
        uint caseNumber = _uintStorage["caseNumber"];

        // What region is the case for, only users with same region will be able to vote on this proposal
        string memory _region = _users[msg.sender]._stringUser["Region"];

        // This creates a case
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._stringCase["Description"] = _description;
        _cases[caseNumber]._stringCase["Region"] = _region;     // Sets proposals region to same as the creator of the case
        
        // Calculate half of the votes needed +1
        limit(caseNumber, _region);

        // Checks that there is an odd number of people that needs to approve the case, odd number of poeple avoids deadlock
        require(_cases[caseNumber]._uintCase["Limit"] % 2 != 0);
        
        // Counts total voters (TotalVotes = Standard + Regional + National).
        totalVotes(caseNumber, _region);

        _cases[caseNumber]._uintCase["Open"] = _open;
        _cases[caseNumber]._uintCase["Close"] = _close;
        _cases[caseNumber]._boolCase["open For Voting"] = false;
        _cases[caseNumber]._boolCase["Case Deactivated"] = false;

        //adding first alternative to Array and giving it all the votes
        _cases[caseNumber]._stringArrayCase["Alternatives"].push("Ikke Stemt");
        _cases[caseNumber]._uintArrayCase["Alternatives"].push(_cases[caseNumber]._uintCase["Total Votes"]);

        for(uint i = 0; i < _alternatives.length; i++){
            _cases[caseNumber]._stringArrayCase["Alternatives"].push(_alternatives[i]);
            _cases[caseNumber]._uintArrayCase["Alternatives"].push(0);
        }
        
        // checks if the information that is going to be stored is the same as the information entered into the function
        for(uint i = 0; i < _alternatives.length; i++){
            assert(keccak256(abi.encodePacked(_cases[caseNumber]._stringArrayCase["Alternatives"][ SafeMath.add(i,1) ])) == keccak256(abi.encodePacked(_alternatives[i])));
            assert(_cases[caseNumber]._uintArrayCase["Alternatives"][ SafeMath.add(i, 1) ] == 0);
        }

        assert(keccak256(abi.encodePacked(
                    _cases[caseNumber]._stringCase["Title"],            _cases[caseNumber]._stringCase["Region"],
                    _cases[caseNumber]._uintCase["Open"],               _cases[caseNumber]._uintCase["Close"],
                    _cases[caseNumber]._boolCase["open For Voting"],    _cases[caseNumber]._stringArrayCase["Alternatives"][0]))
            ==
              keccak256(abi.encodePacked(
                    _title,     _region,
                    _open,      _close,
                    false,      "Ikke Stemt"))
        );
        emit caseCreated(_cases[caseNumber]._stringCase["Title"], _cases[caseNumber]._boolCase["Open For Voting"]);
        
        publishForApproval(caseNumber);
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _close, uint _totalVotes, bool _openForVoting, string[] memory _alternatives, uint[] memory _num){
        require(!_cases[_caseNumber]._boolCase["Case Deactivated"], "case.error.9: This case has been deactivated");
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.10: Case does not exist");
        return (_cases[_caseNumber]._stringCase["Title"],               _cases[_caseNumber]._uintCase["Close"], 
                _cases[_caseNumber]._uintCase["Total Votes"],           _cases[_caseNumber]._boolCase["Open For Voting"], 
                _cases[_caseNumber]._stringArrayCase["Alternatives"],   _cases[_caseNumber]._uintArrayCase["Alternatives"]
        );
    }

    function deactivateCase(uint _caseNumber) public onlyOwner {
        require(!_cases[_caseNumber]._boolCase["Open For Voting"]);
        _cases[_caseNumber]._boolCase["Case Deactivated"] = true;
        clearFromWaiting(_caseNumber);

        emit caseDeleted(_cases[_caseNumber]._stringCase["Title"], _cases[_caseNumber]._boolCase["Open For Voting"]);
        assert(_cases[_caseNumber]._boolCase["Case Deactivated"] == true);
    }
   
    function vote (uint256 _caseNumber, uint256 _optionVoted) public {
        require(_cases[_caseNumber]._boolCase["Open For Voting"], "case.error.7: Not Open For Voting Yet!");  // Checks if the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alternatives"].length, "case.error.8: Pick an option that exists");   // Checks that the option exists
        require(_cases[_caseNumber]._uintCase["Close"] > block.timestamp, "case.error.20: Voting for case has ended");
        require(_cases[_caseNumber]._uintCase["Open"] < block.timestamp, "case.error.22: Case not open for voting yet");
        
        if(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]) { // Has voted
            _cases[_caseNumber]._uintArrayCase["Alternatives"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]] = 
                SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alternatives"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]], 1); // SUBTRACT
        } else { // Has not voted
            _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // Voting = TRUE
            _cases[_caseNumber]._uintArrayCase["Alternatives"][0] = SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alternatives"][0], 1); // SUBTRACT
        }
        _cases[_caseNumber]._uintArrayCase["Alternatives"][_optionVoted] = SafeMath.add(_cases[_caseNumber]._uintArrayCase["Alternatives"][_optionVoted], 1); // ADD

        uint256 oldVote = _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))];
        _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] = _optionVoted; // Map msg.sender => _optionVoted

        assert(_optionVoted != oldVote); // vote has changed
        assert(keccak256(abi.encodePacked( 
                    _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))],
                    _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]
                ))
            == keccak256(abi.encodePacked(
                    _optionVoted,
                    true
                ))
        );
    }

    function getCaseResult(uint _caseNumber) public view returns(string[] memory, uint[] memory){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.29: Case does not exist");
        return (_cases[_caseNumber]._stringArrayCase["Alternatives"], _cases[_caseNumber]._uintArrayCase["Alternatives"]);
    }

    function getAlternatives(uint256 _caseNumber) public view returns(string[] memory _alter , uint256[] memory _alterNum){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.23: Case does not exist");
        return (_cases[_caseNumber]._stringArrayCase["Alternatives"], _cases[_caseNumber]._uintArrayCase["Alternatives"]);
    }

    function getMyVote(uint256 _caseNumber) public view returns(string memory){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.24: Case does not exist");
        return ( _cases[_caseNumber]._stringArrayCase["Alternatives"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
    }

    function getUserArrayLength(string memory _region, string memory _userType) public view returns(uint){
        return _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
    }

    function approveCase(uint _caseNumber) public {
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.25: Case does not exist");
        return approve(_caseNumber);
    }
   function getUser()public view returns(string memory, string memory){
        return(_users[msg.sender]._stringUser["Region"], _users[msg.sender]._stringUser["User Type"]);
    }

    
    function getApprovalLimit(uint _caseNumber) public view returns(uint){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.26: Case does not exist");
        return _cases[_caseNumber]._uintCase["Limit"];
    }
    
    function getTotalVotes(uint _caseNumber) public view returns(uint){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.27: Case does not exist");
        return _cases[_caseNumber]._uintCase["Total Votes"];
    }

    function getApprovalZ(uint _caseNumber) public view returns(uint){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "case.error.28: Case does not exist");
        return getApprovals(_caseNumber);
    }

    function getCasesWaitingForApproval()public view returns(uint[] memory){
        return _uintArrayStorage["Waiting For Approval"];
    }

}