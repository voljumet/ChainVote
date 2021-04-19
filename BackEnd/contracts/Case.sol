// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;


import "./MultiSig.sol";

contract Case is MultiSig {

    event SigningRequestE(string title,uint256 caseNumber);
    event getCaseE(uint256 indexed caseNumber, string title, string description, bool openForVoting, uint256 startDate, uint256 endDate, string[] stringAlt, uint256[] uintAlt, uint256 totalVotes, string region);
    event addApprovalsE(string[] stringAlt, uint256[] uintAlt);
    event getUsersE(uint256 usersWithSameRegionAndUserType); 
    event getUserE(string region, string userType); 
    event totalVotesE(uint256 toalVotes);
    event approvalsE(uint256 numberOfApprovals, uint256 limit);
    event casesWaitingForApprovalE(uint[] casesWaitingForApproval);
    event myVoteE(string votedAlternative);
    
    /*  "receipt.events.userCreatedE.returnValues.confirmationE" in main.js
     *   used for userCreatedE(x x, string confirmation)
     */

     function balance() public payable {
         
     }


    function createUser(string memory _region, string memory _userType) public {
        bytes32 _regionStorageKecc = keccak256(bytes(_users[msg.sender]._stringUser["Region"]));
        bytes32 _userTypeStorageKecc = keccak256(bytes(_users[msg.sender]._stringUser["UserType"]));

        //checks if there are changes
        require(_regionStorageKecc != keccak256(bytes(_region)) || _userTypeStorageKecc != keccak256(bytes(_userType)), "ERR2");

        // checks where there are changes, then applies to storage
        if(keccak256((bytes(_region))) != _regionStorageKecc){
            _users[msg.sender]._stringUser["Region"] = _region;

        }
        if(keccak256((bytes(_userType))) != _userTypeStorageKecc){
            _users[msg.sender]._stringUser["UserType"] = _userType;
            
        }
        _users[msg.sender]._uintUser["Moved"] = block.timestamp;

        if(!_users[msg.sender]._boolUser["Init"]){
            _users[msg.sender]._boolUser["Init"] = true;
        } else {
            for(uint256 i = 0; i < _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length; i++){
                if(_addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ][i] == msg.sender){
                    _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ][i] = _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ][ _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length - 1];
                    _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].pop();
                }
            }
            for(uint256 i = 0; i < _addressArrayStorage[_userType].length; i++){
                if(_addressArrayStorage[_userType][i] == msg.sender){
                    _addressArrayStorage[_userType][i] = _addressArrayStorage[_userType][ _addressArrayStorage[_userType].length - 1];
                    _addressArrayStorage[_userType].pop();
                }
            }
        }
        _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].push(msg.sender); // adds msg.sender to addressArrayStorage[ _region+_userType ]
        _addressArrayStorage[_userType].push(msg.sender); // adds msg.sender to addressArrayStorage[ _userType ]
    

        // uint256 length = _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;     // check length of the array
        assert(bytes32(keccak256(abi.encodePacked(
                    _users[msg.sender]._stringUser["Region"],
                    _users[msg.sender]._stringUser["UserType"]
                     // _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length
                )))
            ==
            bytes32(keccak256(abi.encodePacked(
                    _region,
                    _userType
                    // length += 1     
                )))
        );
        emit confirmationE(true);
    }
    
    function endVoting(uint256 _caseNumber)public {
        require(decitionmaker(_caseNumber), "ERR22");
        if(_cases[_caseNumber]._boolCase["OpenForVoting"]){
            // end voting when the deadline has passed
            require(_cases[_caseNumber]._uintCase["EndDate"] < block.timestamp, "ERR3");
            _cases[_caseNumber]._boolCase["OpenForVoting"] = false; 
            emit addApprovalsE(_cases[_caseNumber]._stringArrayCase["Alt"], _cases[_caseNumber]._uintArrayCase["Alt"]);
        } else {
            // delete case before it has been approved by anyone
            require(_cases[_caseNumber]._uintCase["ApprovalsSigned"] == 0, "ERR6");
            clearFromWaiting(_caseNumber);
            _cases[_caseNumber]._boolCase["CaseDeactivated"] = true;
        }
        assert(!_cases[_caseNumber]._boolCase["OpenForVoting"]);
        emit confirmationE(true);
    }

    function addAlternatives(uint256 _caseNumber, string memory _alternative) public {
        require(decitionmaker(_caseNumber), "ERR23");
        require(_cases[_caseNumber]._uintCase["ApprovalsSigned"] == 0, "ERR28");
        require(!_cases[_caseNumber]._boolCase["OpenForVoting"] && !_cases[_caseNumber]._boolCase["CaseDeactivated"] && 
                _caseNumber <= _uintStorage["CaseNumber"] && _caseNumber != 0 && keccak256(bytes(_alternative)) != keccak256(bytes("")), "ERR20");
        _cases[_caseNumber]._stringArrayCase["Alt"].push(_alternative);
        _cases[_caseNumber]._uintArrayCase["Alt"].push(0);
        assert(keccak256(bytes(_cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._stringArrayCase["Alt"].length-1 ])) == keccak256(bytes(_alternative)));
        emit addApprovalsE(_cases[_caseNumber]._stringArrayCase["Alt"], _cases[_caseNumber]._uintArrayCase["Alt"]);
    }

    function createCase(string memory _title, string memory _description, uint256 _startDate, uint256 _endDate, string memory _alt1, string memory _alt2) public {
        string memory _userType = _users[msg.sender]._stringUser["UserType"];
        require(keccak256(bytes(_userType)) == keccak256(bytes("Admin")) ||
            keccak256(bytes(_userType)) == keccak256(bytes("SuperAdmin")), "ERR4"); // checks that the userType is "Admin" or "SuperAdmin"
        require(_startDate > block.timestamp && _endDate > block.timestamp, "ERR12");
        require(keccak256(bytes(_title)) != keccak256(bytes("")) && keccak256(bytes(_description)) != keccak256(bytes(""))&& 
                keccak256(bytes(_alt1)) != keccak256(bytes("")) && keccak256(bytes(_alt2)) != keccak256(bytes("")), "ERR29");

        string memory _region = _users[msg.sender]._stringUser["Region"];
        
        // Checks that there is an odd number of people that needs to approve the case to avoid a tie
        if(keccak256(bytes(_userType)) == keccak256(bytes("Admin"))){
            require(_addressArrayStorage[ string(abi.encodePacked(_region, _userType )) ].length % 2 != 0, "ERR31");
        } else if(keccak256(bytes(_userType)) == keccak256(bytes("SuperAdmin"))){
            require(_addressArrayStorage["SuperAdmin"].length % 2 != 0, "ERR34");
        }

        _uintStorage["CaseNumber"] += 1; // "Global" Case Number Counter
        uint256 caseNumber = _uintStorage["CaseNumber"];

        // This creates a case
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._stringCase["Description"] = _description;
        
        // Calculate half of the votes needed +1
        _cases[caseNumber]._uintCase["ApprovalsNeeded"] = (((_addressArrayStorage[ string(abi.encodePacked(_region, _userType )) ].length * 10) /2) +5) /10;
        
        _cases[caseNumber]._uintCase["CaseCreated"] = block.timestamp;
        // Counts total voters (TotalVotes = Standard + Regional + National).
        if(keccak256(bytes(_userType)) == keccak256(bytes("Admin"))){
            _cases[caseNumber]._stringCase["Region"] = _region; 
            _cases[caseNumber]._uintCase["TotalVotes"] = _addressArrayStorage[ string(abi.encodePacked(_region,"SuperAdmin")) ].length
                                                        + _addressArrayStorage[ string(abi.encodePacked(_region,"Admin")) ].length
                                                        + _addressArrayStorage[ string(abi.encodePacked(_region,"Standard")) ].length;

        } else if(keccak256(bytes(_userType)) == keccak256(bytes("SuperAdmin"))){

            _cases[caseNumber]._boolCase["National"] = true;
            _cases[caseNumber]._uintCase["TotalVotes"] = _addressArrayStorage["SuperAdmin"].length
                + _addressArrayStorage["Admin"].length + _addressArrayStorage["Standard"].length;
        }
        
        // adding mandatory first alternative to Array and giving it all the votes
        _cases[caseNumber]._stringArrayCase["Alt"].push("NotVoted");
        _cases[caseNumber]._uintArrayCase["Alt"].push(_cases[caseNumber]._uintCase["TotalVotes"]);

        _cases[caseNumber]._stringArrayCase["Alt"].push(_alt1);
        _cases[caseNumber]._stringArrayCase["Alt"].push(_alt2);
        _cases[caseNumber]._uintArrayCase["Alt"].push(0);
        _cases[caseNumber]._uintArrayCase["Alt"].push(0);
    

        _cases[caseNumber]._uintCase["StartDate"] = _startDate;
        _cases[caseNumber]._uintCase["EndDate"] = _endDate;
        _cases[caseNumber]._boolCase["OpenForVoting"] = false;
        _cases[caseNumber]._boolCase["CaseDeactivated"] = false;
        
        // checks if the information that is going to be stored is the same as the information entered into the function
        // for(uint256 i = 0; i < _cases[caseNumber]._stringArrayCase["Alt"].length; i++){
        //     assert(keccak256(abi.encodePacked(_cases[caseNumber]._stringArrayCase["Alt"][i+1])) == keccak256(abi.encodePacked(alt[i])) && 
        //             _cases[caseNumber]._uintArrayCase["Alt"][i+1] == 0);
        // }
        _cases[caseNumber]._uintCase["ApprovalsSigned"] = 0;        // Initialize approvals
        _uintArrayStorage["WaitingForApproval"].push(caseNumber);   // Add to waiting list

        assert(keccak256(abi.encodePacked(
                    _cases[caseNumber]._stringCase["Title"],          
                    _cases[caseNumber]._uintCase["StartDate"],        _cases[caseNumber]._uintCase["EndDate"],
                    _cases[caseNumber]._boolCase["OpenForVoting"],    _cases[caseNumber]._stringArrayCase["Alt"][0]))
            ==
              keccak256(abi.encodePacked(
                    _title,     
                    _startDate,      _endDate,
                    false,      "NotVoted"))
        );


        emit confirmationE(true);
        emit SigningRequestE(_cases[caseNumber]._stringCase["Title"], caseNumber);
        emit getCaseE(caseNumber, _title, _description, _cases[caseNumber]._boolCase["OpenForVoting"], _startDate, _endDate, _cases[caseNumber]._stringArrayCase["Alt"], _cases[caseNumber]._uintArrayCase["Alt"], _cases[caseNumber]._uintCase["TotalVotes"], _region);
    }
   
    function vote(uint256 _caseNumber, uint256 _optionVoted) public {
        require(_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR7");  // Checks that the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alt"].length, "ERR8");   // Checks that the voting option exists
        require(_cases[_caseNumber]._uintCase["EndDate"] > block.timestamp && _cases[_caseNumber]._uintCase["StartDate"] < block.timestamp, "ERR9" );
        require(keccak256(bytes(_users[msg.sender]._stringUser["Region"])) == keccak256(bytes(_cases[_caseNumber]._stringCase["Region"])) || _cases[_caseNumber]._boolCase["National"], "ERR32");
        require(_users[msg.sender]._uintUser["Moved"] <= _cases[_caseNumber]._uintCase["CaseCreated"], "");

        if(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]) { // Has voted
            _cases[_caseNumber]._uintArrayCase["Alt"][_cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))]] -= 1; // SUBTRACT
        } else { // Has not voted
            _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // Voting = TRUE
            _cases[_caseNumber]._uintArrayCase["Alt"][0] -= 1; // SUBTRACT
        }
        _cases[_caseNumber]._uintArrayCase["Alt"][_optionVoted] += 1; // ADD

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

    function getMyVote(uint256 _caseNumber) public {
        require(_caseNumber <= _uintStorage["CaseNumber"] && _caseNumber != 0, "ERR13");
        emit myVoteE( _cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
    }

    function getApprovalsAndLimit(uint256 _caseNumber) public {
        require(_caseNumber <= _uintStorage["CaseNumber"] && _caseNumber != 0, "ERR15");
        require(!_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR30");
        emit approvalsE(_cases[_caseNumber]._uintCase["ApprovalsSigned"], _cases[_caseNumber]._uintCase["ApprovalsNeeded"]);
    }

    // function getCase(uint256 _caseNumber) public {
    //     require(!_cases[_caseNumber]._boolCase["CaseDeactivated"], "ERR10");
    //     require(_caseNumber <= _uintStorage["CaseNumber"] && _caseNumber != 0, "ERR11");
    //     emit getCaseE(_caseNumber,                                  _cases[_caseNumber]._stringCase["Title"], 
    //                 _cases[_caseNumber]._stringCase["Description"], _cases[_caseNumber]._boolCase["OpenForVoting"], 
    //                 _cases[_caseNumber]._uintCase["StartDate"],     _cases[_caseNumber]._uintCase["EndDate"], 
    //                 _cases[_caseNumber]._stringArrayCase["Alt"],    _cases[_caseNumber]._uintArrayCase["Alt"], 
    //                 _cases[_caseNumber]._uintCase["TotalVotes"],    _users[msg.sender]._stringUser["Region"]);
    // }

    function getUserArrayLength(string memory _region, string memory _userType) public view returns(uint retur){
        // emit getUsersE(_addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length);
        return _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
    }

    function usersOfType(string memory _userType) public view returns(uint usersOT){
        return _addressArrayStorage[_userType].length;
    }
    
    // function getTotalVotes(uint256 _caseNumber) public {
    //     require(_caseNumber <= _uintStorage["CaseNumber"] && _caseNumber != 0, "ERR14");
    //     emit totalVotesE(_cases[_caseNumber]._uintCase["TotalVotes"]);
    // }

    function getUser() public view returns(string memory region, string memory utype){
        // emit getUserE(_users[msg.sender]._stringUser["Region"], _users[msg.sender]._stringUser["UserType"]);
        return (_users[msg.sender]._stringUser["Region"], _users[msg.sender]._stringUser["UserType"]);
    }

    // function getCasesWaitingForApproval() public {
    //     emit casesWaitingForApprovalE(_uintArrayStorage["WaitingForApproval"]);
    // }

}