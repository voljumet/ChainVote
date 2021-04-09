// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;


import "./MultiSig.sol";


contract Case is MultiSig {

    using SafeMath for uint256;

    event SigningRequestE(string title,uint256 caseNumber);
    event getCaseE(uint256 indexed caseNumber, string title, string description, bool openForVoting, uint256 startDate, uint256 endDate, string[] stringAlt, uint256[] uintAlt, uint256 totalVotes, string region);
    event addApprovalsE(string[] stringAlt, uint256[] uintAlt);
    event getUsersE(uint256 usersWithSameRegionAndUserType); 
    event getUserE(string region, string userType); 
    event totalVotesE(uint256 toalVotes);
    event approvalsE(uint256 numberOfApprovals, uint256 limit);
    event casesWaitingForApprovalE(uint[] casesWaitingForApproval);
    event myVoteE(string votedAlternative);
    
    /* 
        "receipt.events.userCreatedE.returnValues.confirmationE" in main.js
        used for userCreatedE(x x, string confirmation)
    */


    function createUser(string memory _region, string memory _userType) public {
        require(keccak256( bytes(_users[msg.sender]._stringUser["Region"])) != keccak256(bytes(_region)) ||
                keccak256( bytes(_users[msg.sender]._stringUser["UserType"])) != keccak256(bytes(_userType)), "ERR2");

        if(keccak256((bytes(_region))) != keccak256((bytes(_users[msg.sender]._stringUser["Region"])))){
            _users[msg.sender]._stringUser["Region"] = _region;
        }
        if(keccak256((bytes(_userType))) != keccak256((bytes(_users[msg.sender]._stringUser["UserType"])))){
            _users[msg.sender]._stringUser["UserType"] = _userType;
        }

        uint256 length =  _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
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
        emit confirmationE(true);
        emit getUserE(_region, _userType);
    }
    
    function endVoting(uint256 _caseNumber)public {
        require(onlyOwners(_caseNumber), "ERR22");
        if(_cases[_caseNumber]._boolCase["OpenForVoting"]){
            require(_cases[_caseNumber]._uintCase["EndDate"] < block.timestamp, "ERR3");
            _cases[_caseNumber]._boolCase["openForVoting"] = false; 
            emit addApprovalsE(_cases[_caseNumber]._stringArrayCase["Alt"], _cases[_caseNumber]._uintArrayCase["Alt"]);
        } else {
            require(_cases[_caseNumber]._uintCase["ApprovalsSigned"] == 0, "ERR6");
            clearFromWaiting(_caseNumber);
            _cases[_caseNumber]._boolCase["CaseDeactivated"] = true;
        }
        assert(_cases[_caseNumber]._boolCase["openForVoting"] = false);
        emit confirmationE(true);
    }

    function addAlternatives(uint256 _caseNumber, string memory _alternative) public {
        require(onlyOwners(_caseNumber), "ERR23");
        require(_cases[_caseNumber]._uintCase["ApprovalsSigned"] == 0, "ERR28");
        require(!_cases[_caseNumber]._boolCase["openForVoting"] && !_cases[_caseNumber]._boolCase["CaseDeactivated"] && 
                _caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0 && keccak256(bytes(_alternative)) != keccak256(bytes("")), "ERR20");
        _cases[_caseNumber]._stringArrayCase["Alt"].push(_alternative);
        _cases[_caseNumber]._uintArrayCase["Alt"].push(0);
        assert(keccak256(bytes(_cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._stringArrayCase["Alt"].length-1 ])) == keccak256(bytes(_alternative)));
        emit addApprovalsE(_cases[_caseNumber]._stringArrayCase["Alt"], _cases[_caseNumber]._uintArrayCase["Alt"]);
    }

    function createCase(string memory _title, string memory _description, uint256 _startDate, uint256 _endDate, string memory _alt1, string memory _alt2) public {
        require(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("Admin")) ||
            keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("SuperAdmin")), "ERR4"); // checks that the userType is "Admin" or "SuperAdmin"
        require(_startDate > block.timestamp && _endDate > block.timestamp, "ERR12");
        require(keccak256(bytes(_title)) != keccak256(bytes("")) && keccak256(bytes(_description)) != keccak256(bytes(""))&& 
                keccak256(bytes(_alt1)) != keccak256(bytes("")) && keccak256(bytes(_alt2)) != keccak256(bytes("")), "ERR29");
        string memory _region = _users[msg.sender]._stringUser["Region"];
        
        // Checks that there is an odd number of people that needs to approve the case to avoid a tie
        require(_addressArrayStorage[ string(abi.encodePacked(_region, _users[msg.sender]._stringUser["UserType"] )) ].length % 2 != 0, "ERR31");

        _uintStorage["caseNumber"] = _uintStorage["caseNumber"].add(1); // "Global" Case Number Counter
        uint256 caseNumber = _uintStorage["caseNumber"];

        // This creates a case
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._stringCase["Description"] = _description;
        _cases[caseNumber]._stringCase["Region"] = _region;     // Sets proposals region to same as the creator of the case
        
        // Calculate half of the votes needed +1
        _cases[caseNumber]._uintCase["ApprovalsNeeded"] = _addressArrayStorage[ string(abi.encodePacked(_region, _users[msg.sender]._stringUser["UserType"] )) ].length.mul(10).div(2).add(5).div(10);
        
        // Counts total voters (TotalVotes = Standard + Regional + National).
        _cases[caseNumber]._uintCase["TotalVotes"] = 
            _addressArrayStorage[ string(abi.encodePacked(_region,"SuperAdmin")) ].length
            .add(_addressArrayStorage[ string(abi.encodePacked(_region,"Admin")) ].length)
            .add(_addressArrayStorage[ string(abi.encodePacked(_region,"Standard")) ].length);

        // adding mandatory first alternative to Array and giving it all the votes
        _cases[caseNumber]._stringArrayCase["Alt"].push("Not voted");
        _cases[caseNumber]._uintArrayCase["Alt"].push(_cases[caseNumber]._uintCase["TotalVotes"]);

        _cases[caseNumber]._stringArrayCase["Alt"].push(_alt1);
        _cases[caseNumber]._stringArrayCase["Alt"].push(_alt2);
        _cases[caseNumber]._uintArrayCase["Alt"].push(0);
        _cases[caseNumber]._uintArrayCase["Alt"].push(0);
    

        _cases[caseNumber]._uintCase["StartDate"] = _startDate;
        _cases[caseNumber]._uintCase["EndDate"] = _endDate;
        _cases[caseNumber]._boolCase["openForVoting"] = false;
        _cases[caseNumber]._boolCase["CaseDeactivated"] = false;
        
        // checks if the information that is going to be stored is the same as the information entered into the function
        // for(uint256 i = 0; i < _cases[caseNumber]._stringArrayCase["Alt"].length; i++){
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

        _cases[caseNumber]._uintCase["ApprovalsSigned"] = 0;        // Initialize approvals
        _uintArrayStorage["WaitingForApproval"].push(caseNumber);   // Add to waiting list

        emit confirmationE(true);
        emit SigningRequestE(_cases[caseNumber]._stringCase["Title"], caseNumber);
        emit getCaseE(caseNumber, _title, _description, _cases[caseNumber]._boolCase["openForVoting"], _startDate, _endDate, _cases[caseNumber]._stringArrayCase["Alt"], _cases[caseNumber]._uintArrayCase["Alt"], _cases[caseNumber]._uintCase["TotalVotes"], _region);
    }
   
    function vote(uint256 _caseNumber, uint256 _optionVoted) public {
        require(_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR7");  // Checks that the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alt"].length, "ERR8");   // Checks that the voting option exists
        require(_cases[_caseNumber]._uintCase["EndDate"] > block.timestamp , "ERR9" );
        require(_cases[_caseNumber]._uintCase["StartDate"] < block.timestamp, "ERR9.1");
        
        if(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]) { // Has voted
            _cases[_caseNumber]._uintArrayCase["Alt"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]] = 
                _cases[_caseNumber]._uintArrayCase["Alt"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]].sub(1); // SUBTRACT
        } else { // Has not voted
            _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // Voting = TRUE
            _cases[_caseNumber]._uintArrayCase["Alt"][0] = _cases[_caseNumber]._uintArrayCase["Alt"][0].sub(1); // SUBTRACT
        }
        _cases[_caseNumber]._uintArrayCase["Alt"][_optionVoted] = _cases[_caseNumber]._uintArrayCase["Alt"][_optionVoted].add(1); // ADD

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
        emit confirmationE(true);
        emit casesWaitingForApprovalE(_cases[_caseNumber]._uintArrayCase["Alt"]);
    }

    // function getCase(uint256 _caseNumber) public {
    //     require(!_cases[_caseNumber]._boolCase["CaseDeactivated"], "ERR10");
    //     require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR11");
    //     emit getCaseE(_caseNumber,                                  _cases[_caseNumber]._stringCase["Title"], 
    //                 _cases[_caseNumber]._stringCase["Description"], _cases[_caseNumber]._boolCase["OpenForVoting"], 
    //                 _cases[_caseNumber]._uintCase["StartDate"],     _cases[_caseNumber]._uintCase["EndDate"], 
    //                 _cases[_caseNumber]._stringArrayCase["Alt"],    _cases[_caseNumber]._uintArrayCase["Alt"], 
    //                 _cases[_caseNumber]._uintCase["TotalVotes"],    _users[msg.sender]._stringUser["Region"]);
    // }

    function getMyVote(uint256 _caseNumber) public {
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR13");
        emit myVoteE( _cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
    }

    // function getUserArrayLength(string memory _region, string memory _userType) public {
    //     emit getUsersE(_addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length);
    // }
    
    // function getTotalVotes(uint256 _caseNumber) public {
    //     require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR14");
    //     emit totalVotesE(_cases[_caseNumber]._uintCase["TotalVotes"]);
    // }

    function getApprovalsAndLimit(uint256 _caseNumber) public {
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR15");
        require(!_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR30");
        emit approvalsE(_cases[_caseNumber]._uintCase["ApprovalsSigned"], _cases[_caseNumber]._uintCase["ApprovalsNeeded"]);
    }

    // function getUser() public {
    //     emit getUserE(_users[msg.sender]._stringUser["Region"], _users[msg.sender]._stringUser["UserType"]);
    // }

    // function getCasesWaitingForApproval() public {
    //     emit casesWaitingForApprovalE(_uintArrayStorage["WaitingForApproval"]);
    // }

}