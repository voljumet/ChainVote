// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Ownable.sol";
import "./MultiSig.sol";

contract Case is Ownable, MultiSig {

    event SigningRequestE(string title,uint caseNumber);
    event getCaseE(uint indexed caseNumber, string title, string description, bool openForVoting, uint256 startDate, uint256 endDate, string[] stringAlt, uint[] uintAlt, uint totalVotes, string region);
    event getUsersE(uint usersWithSameRegionAndUserType); 
    event getUserE(string region, string userType); 
    event totalVotesE(uint toalVotes);
    event approvalsE(uint numberOfApprovals, uint limit);
    event casesWaitingForApprovalE(uint[] casesWaitingForApproval);
    event myVoteE(string votedAlternative);
    
    /* 
        "receipt.events.userCreatedE.returnValues.confirmationE" in main.js
        used for userCreatedE(x x, string confirmation)
    */

    constructor() {
        require(!_boolStorage["initialized"], "ERR1");
        _addressStorage["owner"] = msg.sender;
        _boolStorage["initialized"] = true;

        assert( keccak256(abi.encodePacked(
                     _addressStorage["owner"],
                   _boolStorage["initialized"]))
            ==
                keccak256(abi.encodePacked(
                    msg.sender,
                    true))
        );
    }
    
    function createUser(string memory _region, string memory _userType) public {
        require(keccak256( abi.encodePacked(_users[msg.sender]._stringUser["Region"])) != keccak256(abi.encodePacked(_region)) ||
                keccak256( abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) != keccak256(abi.encodePacked(_userType)), "ERR2");

        if(keccak256((abi.encodePacked(_region))) != keccak256((abi.encodePacked(_users[msg.sender]._stringUser["Region"])))){
            _users[msg.sender]._stringUser["Region"] = _region;
        }
        if(keccak256((abi.encodePacked(_userType))) != keccak256((abi.encodePacked(_users[msg.sender]._stringUser["UserType"])))){
            _users[msg.sender]._stringUser["UserType"] = _userType;
        }

        uint length =  _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
        _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].push(msg.sender); // makes array based on region and usertype

        assert(keccak256(abi.encodePacked(
                    _users[msg.sender]._stringUser["Region"],
                    _users[msg.sender]._stringUser["UserType"],
                     _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length
                ))
            ==
            keccak256(abi.encodePacked(
                    _region,
                    _userType,
                    length+=1     
                ))
        );
        emit confirmationE("User created successfully!");
    }
    
    function endVoting(uint _caseNumber)public onlyOwners(_caseNumber){
        require(_cases[_caseNumber]._uintCase["EndDate"] < block.timestamp, "ERR3");
        _cases[_caseNumber]._boolCase["openForVoting"] = false; 
        assert(_cases[_caseNumber]._boolCase["openForVoting"] = false);
        emit confirmationE("Voting closed successfully");
    }

    function addAlternatives(uint256 _caseNumber, string memory _alternative) public onlyOwners(_caseNumber) {
        require(_cases[_caseNumber]._boolCase["openForVoting"] == false && _cases[_caseNumber]._boolCase["CaseDeactivated"] == false && 
                _caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0 && keccak256(abi.encodePacked(_alternative)) != keccak256(abi.encodePacked("")), "ERR20");
        _cases[_caseNumber]._stringArrayCase["Alt"].push(_alternative);
        _cases[_caseNumber]._uintArrayCase["Alt"].push(0);
        assert(keccak256(abi.encodePacked(_cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._stringArrayCase["Alt"].length-1 ])) == keccak256(abi.encodePacked(_alternative)));
   }

    function createCase(string memory _title, string memory _description, uint256 _startDate, uint256 _endDate, string memory _alt1, string memory _alt2) public {
        require(keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("Regional")) ||
            keccak256(abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) == keccak256(abi.encodePacked("National")), "ERR4"); // checks that the userType is "Regional" or "National"
        require(keccak256(abi.encodePacked(_title)) != keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(_description)) != keccak256(abi.encodePacked("")) && _startDate > block.timestamp 
            && _endDate > block.timestamp && keccak256(abi.encodePacked(_alt1)) != keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(_alt2)) != keccak256(abi.encodePacked("")), "ERR12");

        _uintStorage["caseNumber"] = SafeMath.add(_uintStorage["caseNumber"], 1); // "Global" Case Number Counter
        uint caseNumber = _uintStorage["caseNumber"];

        // What region is the case for, only users with same region will be able to vote on this proposal
        // adding first alternative to Array and giving it all the votes
        _cases[caseNumber]._stringArrayCase["Alt"].push("Not voted");
        _cases[caseNumber]._uintArrayCase["Alt"].push(_cases[caseNumber]._uintCase["TotalVotes"]);

        _cases[caseNumber]._stringArrayCase["Alt"].push(_alt1);
        _cases[caseNumber]._stringArrayCase["Alt"].push(_alt2);
        _cases[caseNumber]._uintArrayCase["Alt"].push(0);
        _cases[caseNumber]._uintArrayCase["Alt"].push(0);
       
        // This creates a case
        string memory _region = _users[msg.sender]._stringUser["Region"];
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._stringCase["Description"] = _description;
        _cases[caseNumber]._stringCase["Region"] = _region;     // Sets proposals region to same as the creator of the case
        
        // Calculate half of the votes needed +1
        _cases[caseNumber]._uintCase["Limit"] = 
        SafeMath.div(
            SafeMath.add(
                SafeMath.div(
                    SafeMath.mul(
                        _addressArrayStorage[ string(abi.encodePacked(_region, _users[msg.sender]._stringUser["UserType"] )) ].length, 
                    10),
                2),
            5),
        10);

        // Checks that there is an odd number of people that needs to approve the case, odd number of poeple avoids deadlock
        require(_cases[caseNumber]._uintCase["Limit"] % 2 != 0, "ERR5");
        
        // Counts total voters (TotalVotes = Standard + Regional + National).
        _cases[caseNumber]._uintCase["TotalVotes"] = 
            SafeMath.add(_addressArrayStorage[ string(abi.encodePacked(_region,"National")) ].length, 
                SafeMath.add(_addressArrayStorage[ string(abi.encodePacked(_region,"Standard")) ].length, 
                                _addressArrayStorage[ string(abi.encodePacked(_region,"Regional")) ].length));

        _cases[caseNumber]._uintCase["StartDate"] = _startDate;
        _cases[caseNumber]._uintCase["EndDate"] = _endDate;
        _cases[caseNumber]._boolCase["openForVoting"] = false;
        _cases[caseNumber]._boolCase["CaseDeactivated"] = false;
        
        // checks if the information that is going to be stored is the same as the information entered into the function
        // for(uint i = 0; i < _cases[caseNumber]._stringArrayCase["Alt"].length; i++){
        //     assert(keccak256(abi.encodePacked(_cases[caseNumber]._stringArrayCase["Alt"][i+1])) == keccak256(abi.encodePacked(alt[i])) && 
        //             _cases[caseNumber]._uintArrayCase["Alt"][i+1] == 0);
        // }

        assert(keccak256(abi.encodePacked(
                    _cases[caseNumber]._stringCase["Title"],          _cases[caseNumber]._stringCase["Region"],
                    _cases[caseNumber]._uintCase["StartDate"],        _cases[caseNumber]._uintCase["EndDate"],
                    _cases[caseNumber]._boolCase["openForVoting"],    _cases[caseNumber]._stringArrayCase["Alt"][0]))
            ==
              keccak256(abi.encodePacked(
                    _title,     _region,
                    _startDate,      _endDate,
                    false,      "Not voted"))
        );

        _cases[caseNumber]._uintCase["Approvals"] = 0;                 // Initialize approvals
        _uintArrayStorage["WaitingForApproval"].push(caseNumber);    // Add to waiting list

        emit confirmationE("Case created successfully!");
        emit SigningRequestE(_cases[caseNumber]._stringCase["Title"], caseNumber);
        emit getCaseE(caseNumber, _title, _description, _cases[caseNumber]._boolCase["openForVoting"], _startDate, _endDate, _cases[caseNumber]._stringArrayCase["Alt"], _cases[caseNumber]._uintArrayCase["Alt"], _cases[caseNumber]._uintCase["TotalVotes"], _region);
    }

    function deactivateCase(uint _caseNumber) public onlyOwner {
        require(!_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR6");
        _cases[_caseNumber]._boolCase["CaseDeactivated"] = true;
        clearFromWaiting(_caseNumber);

        assert(_cases[_caseNumber]._boolCase["CaseDeactivated"] == true);
        emit confirmationE("Case deactivated successfully");
    }
   
    function vote(uint256 _caseNumber, uint256 _optionVoted) public {
        require(_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR7");  // Checks that the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alt"].length, "ERR8");   // Checks that the voting option exists
       // require(_cases[_caseNumber]._uintCase["EndDate"] > block.timestamp && _cases[_caseNumber]._uintCase["StartDate"] < block.timestamp, "ERR9");
        
        if(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]) { // Has voted
            _cases[_caseNumber]._uintArrayCase["Alt"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]] = 
                SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alt"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]], 1); // SUBTRACT
        } else { // Has not voted
            _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // Voting = TRUE
            _cases[_caseNumber]._uintArrayCase["Alt"][0] = SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alt"][0], 1); // SUBTRACT
        }
        _cases[_caseNumber]._uintArrayCase["Alt"][_optionVoted] = SafeMath.add(_cases[_caseNumber]._uintArrayCase["Alt"][_optionVoted], 1); // ADD

        uint256 oldVote = _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))];
        _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] = _optionVoted; // Map msg.sender => _optionVoted

        assert(_optionVoted != oldVote && keccak256(abi.encodePacked( 
                    _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))],
                    _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]
                ))
            == keccak256(abi.encodePacked(
                    _optionVoted,
                    true
                ))
        );
        emit confirmationE("Vote has been registered");
    }

    function getCase(uint _caseNumber) public {
        require(!_cases[_caseNumber]._boolCase["CaseDeactivated"], "ERR10");
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR11");
        emit getCaseE(_caseNumber,                                  _cases[_caseNumber]._stringCase["Title"], 
                    _cases[_caseNumber]._stringCase["Description"], _cases[_caseNumber]._boolCase["OpenForVoting"], 
                    _cases[_caseNumber]._uintCase["StartDate"],     _cases[_caseNumber]._uintCase["EndDate"], 
                    _cases[_caseNumber]._stringArrayCase["Alt"],    _cases[_caseNumber]._uintArrayCase["Alt"], 
                    _cases[_caseNumber]._uintCase["TotalVotes"],    _users[msg.sender]._stringUser["Region"]);
    }

    function getMyVote(uint256 _caseNumber) public {
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR13");
        emit myVoteE( _cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
    }

    function getUserArrayLength(string memory _region, string memory _userType) public {
        emit getUsersE(_addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length);
    }
    
    function getTotalVotes(uint _caseNumber) public {
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR14");
        emit totalVotesE(_cases[_caseNumber]._uintCase["TotalVotes"]);
    }

    function getApprovalsAndLimit(uint _caseNumber) public {
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR15");
        emit approvalsE(_cases[_caseNumber]._uintCase["Approvals"], _cases[_caseNumber]._uintCase["Limit"]);
    }

    function getUser() public {
        emit getUserE(_users[msg.sender]._stringUser["Region"], _users[msg.sender]._stringUser["UserType"]);
    }

    function getCasesWaitingForApproval() public {
        emit casesWaitingForApprovalE(_uintArrayStorage["WaitingForApproval"]);
    }

}