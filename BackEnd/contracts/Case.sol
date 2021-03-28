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
        _users[msg.sender]._stringUser["Region"] = _region;
        _users[msg.sender]._stringUser["User Type"] = _userType;
        
        _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].push(msg.sender); // makes array based on region and usertype
    }
    
    function getUserArrayLength(string memory _region, string memory _userType) public view returns(uint){
        return _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
    }
    
    function initialize(address _owner) private {
        require(!_boolStorage["initialized"], "ERR6: initialized");
        _addressStorage["owner"] = _owner;
        _boolStorage["initialized"] = true;
    }

    event caseCreated(string title, bool openForVoting);
    event caseDeleted(string title, bool openForVoting);
    event votingOpened(uint256 caseNumber, string title);
    event votingClosed(uint256 caseNumber, string title);
    
    function approvalZ(uint _caseNumber) public {
        approve(_caseNumber);
    }
    
    function getSigningRequestsZ(uint _caseNumber) public view returns(string memory, uint){
        return getSigningRequests(_caseNumber);
    }
    
    function returnLimitApproval(uint _caseNumber) public view returns(uint){
        return _cases[_caseNumber]._uintCase["Limit"];
    }
    
    function returnTotalVotes(uint _caseNumber) public view returns(uint){
        return _cases[_caseNumber]._uintCase["Total Votes"];
    }

    function getApprovalZ(uint _caseNumber) public view returns(uint){
        return getApproval(_caseNumber);
    }

    function createCase(string memory _title, uint256 _deadline, string[] memory _alternatives) public {
        require(checkUserTypeBool(),"ERR1: Not Regional or National"); // checks that the userType is "Regional" or "National"
        _uintStorage["caseNumber"] = SafeMath.add(_uintStorage["caseNumber"], 1); // "Global" Case Number Counter
        uint caseNumber = _uintStorage["caseNumber"];
        string memory _region = _users[msg.sender]._stringUser["Region"];
        // This creates a case
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._stringCase["Region"] = _region; // Case-region used from user
        
        // tall på antall stemer som trengs "((((7 *10) /2) +5) /10)" for å approve casen i MultiSig
        _cases[caseNumber]._uintCase["Limit"] = 
        SafeMath.div(
            SafeMath.add(
                SafeMath.div(
                    SafeMath.mul(
                        _addressArrayStorage[ string(abi.encodePacked(_region,checkUserTypeString())) ].length, 
                    10),
                2),
            5),
        10);
        
        // totalVotes = Standard+Regional+National
        _cases[caseNumber]._uintCase["Total Votes"] = _addressArrayStorage[ string(abi.encodePacked(_region,"Standard")) ].length;
        _cases[caseNumber]._uintCase["Total Votes"] += _addressArrayStorage[ string(abi.encodePacked(_region,"Regional")) ].length;
        _cases[caseNumber]._uintCase["Total Votes"] += _addressArrayStorage[ string(abi.encodePacked(_region,"National")) ].length;

        _cases[caseNumber]._uintCase["Deadline"] = _deadline;
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
            assert(keccak256(abi.encodePacked(_cases[caseNumber]._stringArrayCase["Alternatives"][i+1])) == keccak256(abi.encodePacked(_alternatives[i])));
            assert(_cases[caseNumber]._uintArrayCase["Alternatives"][i+1] == 0);
        }

        assert(keccak256(abi.encodePacked(
                    _cases[caseNumber]._stringCase["Title"],
                    _cases[caseNumber]._stringCase["Region"],
                    _cases[caseNumber]._uintCase["Deadline"],
                    _cases[caseNumber]._boolCase["open For Voting"],
                    //_cases[caseNumber]._uintCase["Total Votes"],
                    _cases[caseNumber]._stringArrayCase["Alternatives"][0]
                    // _cases[caseNumber]._uintArrayCase["Alternatives"][0]
                ))
            ==
            keccak256(abi.encodePacked(
                    _title,
                    _region,
                    _deadline,
                    false,
                    //_totalVotes,
                    "Ikke Stemt"
                    // _totalVotes
                ))
        );
        assert(_cases[caseNumber]._uintCase["Limit"]%2 != 0);
        emit caseCreated(_cases[caseNumber]._stringCase["Title"], _cases[caseNumber]._boolCase["Open For Voting"]);
        
        publishForApproval(caseNumber);
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting, string[] memory _alternatives, uint[] memory _num){
        require(!_cases[_caseNumber]._boolCase["Case Deactivated"], "ERR9: This case has been deactivated");
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR10: Case does not exist");
        return (_cases[_caseNumber]._stringCase["Title"],               _cases[_caseNumber]._uintCase["Deadline"], 
                _cases[_caseNumber]._uintCase["Total Votes"],           _cases[_caseNumber]._boolCase["Open For Voting"], 
                _cases[_caseNumber]._stringArrayCase["Alternatives"],   _cases[_caseNumber]._uintArrayCase["Alternatives"]
        );
    }

    // Problematisk å slette? Ligger på BC, så det går vel ikke akkurat å gjøre, bygge om til deactivate?
    function deleteCase(uint _caseNumber) public onlyOwner {
        require(!_cases[_caseNumber]._boolCase["Open For Voting"]);

        _cases[_caseNumber]._boolCase["Case Deactivated"] = true;

        emit caseDeleted(_cases[_caseNumber]._stringCase["Title"], _cases[_caseNumber]._boolCase["Open For Voting"]);
   }
   
   function vote (uint256 _caseNumber, uint256 _optionVoted) public {
       // time logic?
        require(_cases[_caseNumber]._boolCase["Open For Voting"], "ERR7: Not Open For Voting Yet!");  // Checks if the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alternatives"].length, "ERR8: Pick an option that exists");   // Checks that the option exists

        if(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]) { // Has voted
            _cases[_caseNumber]._uintArrayCase["Alternatives"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]] = 
                SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alternatives"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]], 1); // SUBTRACT
        } else { // Has not voted
            _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // VOTING = TRUE
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

   function getAlternatives(uint256 _caseNumber) public view returns(string[] memory, uint256[] memory){
        return (_cases[_caseNumber]._stringArrayCase["Alternatives"], _cases[_caseNumber]._uintArrayCase["Alternatives"]);
   }

   function getMyVote(uint256 _caseNumber) public view returns(string memory){
      require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "Case does not exist");
        return ( _cases[_caseNumber]._stringArrayCase["Alternatives"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
   }

// testing time logic
    uint time;
    
    function test(uint _deadline_in_x_days) public returns(uint, uint){
        time = block.timestamp + _deadline_in_x_days*5; // blir deadline
        return (time, block.timestamp);
    }
    
    function tryer() public view returns(string memory ads){
        if(time > block.timestamp){
            return "wait for time to pass";
        } else {
            return "now is after deadline";
        }
    }

}