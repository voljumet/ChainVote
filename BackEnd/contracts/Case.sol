// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Ownable.sol";
import "./MultiSig.sol";

contract Case is Ownable, MultiSig {

    event caseCreated(uint indexed caseNumber, string indexed title, string description, bool openForVoting, uint256 startDate, uint256 endDate, string[] stringAlt, uint[] uintAlt, uint totalVotes, string indexed region, string confirmation);
    event caseDeleted(string title, bool openForVoting);
    event votingOpened(uint256 caseNumber, string title);
    event votingClosed(uint256 caseNumber, string title);
    event SigningRequestCreated(string title,uint _caseNumber);
    event CloseVoting(string); // Result needed
    event getUsers(uint numberOfUsers); 
    event userCreated(address userAddress, string confirmation);
    /* ""receipt.events.userCreated.returnValues.confirmation"" in main.js
        use for userCreated(x x, string confirmation) */

    constructor() {
        initialize(msg.sender);
    }
    
    function createUser(string memory _region, string memory _userType) public {
        require(keccak256( abi.encodePacked(_users[msg.sender]._stringUser["Region"])) != keccak256(abi.encodePacked(_region)) ||
                keccak256( abi.encodePacked(_users[msg.sender]._stringUser["UserType"])) != keccak256(abi.encodePacked(_userType)), "ERR1");

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
        emit userCreated(msg.sender, "User Created successfully");
    }

    function initialize(address _owner) private {
        require(!_boolStorage["initialized"], "ERR2");
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
    
    function endVoting(uint _caseNumber)public onlyOwners(_caseNumber){
        require(_cases[_caseNumber]._uintCase["End Date"] < block.timestamp, "ERR3");
        _cases[_caseNumber]._boolCase["openForVoting"] = false; 
        assert(_cases[_caseNumber]._boolCase["openForVoting"] = false);
        emit CloseVoting(_cases[_caseNumber]._stringCase["Title"]);
    }

    // function createArray(string memory _string) private pure returns(string[] memory){
    //     string memory test = "alex,er,kul";
    //     bytes memory temp;
    //     string[] memory array;

    //     uint j = 0;
    //     for(uint i = 0; i < bytes(test).length; i++){
    //         if(keccak256(abi.encodePacked(bytes(test)[i])) != keccak256(abi.encodePacked(bytes(","))) ){
    //             temp[i] = bytes(test)[i];
    //         } else {
    //             array[j] = string(temp);
    //             j++;
    //         }
    //     }
    // }

    function createCase(string memory _title, string memory _description, uint256 _startDate, uint256 _endDate, string memory _alt1, string memory _alt2,string memory _alt3,string memory _alt4,string memory _alt5) public {
        require(keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("Regional")) ||
            keccak256(bytes(_users[msg.sender]._stringUser["UserType"])) == keccak256(bytes("National")), "ERR4"); // checks that the userType is "Regional" or "National"
        _uintStorage["caseNumber"] = SafeMath.add(_uintStorage["caseNumber"], 1); // "Global" Case Number Counter
        uint caseNumber = _uintStorage["caseNumber"];

        // What region is the case for, only users with same region will be able to vote on this proposal
        string memory _region = _users[msg.sender]._stringUser["Region"];

        // This creates a case
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._stringCase["Description"] = _description;
        _cases[caseNumber]._stringCase["Region"] = _region;     // Sets proposals region to same as the creator of the case
        
        string[5] memory alt = [_alt1,_alt2,_alt3,_alt4,_alt5];
        
        // Calculate half of the votes needed +1
        _cases[caseNumber]._uintCase["Limit"] = 
        SafeMath.div(
            SafeMath.add(
                SafeMath.div(
                    SafeMath.mul(
                        _addressArrayStorage[ string(abi.encodePacked(_region, checkUserTypeString() )) ].length, 
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

        _cases[caseNumber]._uintCase["Start Date"] = _startDate;
        _cases[caseNumber]._uintCase["End Date"] = _endDate;
        _cases[caseNumber]._boolCase["openForVoting"] = false;
        _cases[caseNumber]._boolCase["CaseDeactivated"] = false;

        //adding first alternative to Array and giving it all the votes
        _cases[caseNumber]._stringArrayCase["Alt"].push("Ikke Stemt");
        _cases[caseNumber]._uintArrayCase["Alt"].push(_cases[caseNumber]._uintCase["TotalVotes"]);

        for(uint i = 0; i < alt.length; i++){
            if(keccak256(abi.encodePacked(alt[i])) != keccak256(abi.encodePacked(""))){
                _cases[caseNumber]._stringArrayCase["Alt"].push(alt[i]);
                _cases[caseNumber]._uintArrayCase["Alt"].push(0);
            }
        }
        
        // checks if the information that is going to be stored is the same as the information entered into the function
        for(uint i = 0; i < alt.length; i++){
            assert(keccak256(abi.encodePacked(_cases[caseNumber]._stringArrayCase["Alt"][ SafeMath.add(i,1) ])) == keccak256(abi.encodePacked(alt[i])));
            assert(_cases[caseNumber]._uintArrayCase["Alt"][ SafeMath.add(i, 1) ] == 0);
        }

        assert(keccak256(abi.encodePacked(
                    _cases[caseNumber]._stringCase["Title"],            _cases[caseNumber]._stringCase["Region"],
                    _cases[caseNumber]._uintCase["Start Date"],         _cases[caseNumber]._uintCase["End Date"],
                    _cases[caseNumber]._boolCase["openForVoting"],    _cases[caseNumber]._stringArrayCase["Alt"][0]))
            ==
              keccak256(abi.encodePacked(
                    _title,     _region,
                    _startDate,      _endDate,
                    false,      "Ikke Stemt"))
        );
        emit caseCreated(caseNumber, _title, _description, false, _startDate, _endDate, _cases[caseNumber]._stringArrayCase["Alt"], _cases[caseNumber]._uintArrayCase["Alt"], _cases[caseNumber]._uintCase["TotalVotes"], _region, "Case Created Successfully");
        
        _cases[caseNumber]._uintCase["Approvals"] = 0;                 // Initialize approvals
        _uintArrayStorage["WaitingForApproval"].push(caseNumber);    // Add to waiting list

        emit SigningRequestCreated(_cases[caseNumber]._stringCase["Title"], caseNumber);
    }

    function deactivateCase(uint _caseNumber) public onlyOwner {
        require(!_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR8");
        _cases[_caseNumber]._boolCase["CaseDeactivated"] = true;
        clearFromWaiting(_caseNumber);

        emit caseDeleted(_cases[_caseNumber]._stringCase["Title"], _cases[_caseNumber]._boolCase["OpenForVoting"]);
        assert(_cases[_caseNumber]._boolCase["CaseDeactivated"] == true);
    }
   
    function vote (uint256 _caseNumber, uint256 _optionVoted) public {
        require(_cases[_caseNumber]._boolCase["OpenForVoting"], "ERR9");  // Checks if the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alt"].length, "ERR10");   // Checks that the option exists
        require(_cases[_caseNumber]._uintCase["End Date"] > block.timestamp, "ERR11");
        require(_cases[_caseNumber]._uintCase["Start Date"] < block.timestamp, "ERR12");
        
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

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _endDate, uint _totalVotes, bool _startDateForVoting, string[] memory _alt, uint[] memory _num){
        require(!_cases[_caseNumber]._boolCase["CaseDeactivated"], "ERR6");
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR7");
        return (_cases[_caseNumber]._stringCase["Title"],               _cases[_caseNumber]._uintCase["End Date"], 
                _cases[_caseNumber]._uintCase["TotalVotes"],           _cases[_caseNumber]._boolCase["OpenForVoting"], 
                _cases[_caseNumber]._stringArrayCase["Alt"],   _cases[_caseNumber]._uintArrayCase["Alt"]
        );
    }

    function getCaseResult(uint _caseNumber) public view returns(string[] memory, uint[] memory){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR13");
        return (_cases[_caseNumber]._stringArrayCase["Alt"], _cases[_caseNumber]._uintArrayCase["Alt"]);
    }

    // function getAlt(uint256 _caseNumber) public view returns(string[] memory _alter , uint256[] memory _alterNum){
    //     require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR14");
    //     return (_cases[_caseNumber]._stringArrayCase["Alt"], _cases[_caseNumber]._uintArrayCase["Alt"]);
    // }

    function getMyVote(uint256 _caseNumber) public view returns(string memory){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR15");
        return ( _cases[_caseNumber]._stringArrayCase["Alt"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
    }

    function getUserArrayLength(string memory _region, string memory _userType) public returns(uint){
        emit getUsers(_addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length);
        return _addressArrayStorage[ string(abi.encodePacked(_region,_userType)) ].length;
    }

   function getUser()public view returns(string memory, string memory){
        return(_users[msg.sender]._stringUser["Region"], _users[msg.sender]._stringUser["UserType"]);
    }

    function getApprovalLimit(uint _caseNumber) public view returns(uint){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR17");
        return _cases[_caseNumber]._uintCase["Limit"];
    }
    
    function getTotalVotes(uint _caseNumber) public view returns(uint){
        require(_caseNumber <= _uintStorage["caseNumber"] && _caseNumber != 0, "ERR18");
        return _cases[_caseNumber]._uintCase["TotalVotes"];
    }

    function getApprovals(uint _caseNumber) public view returns(uint){
        return _cases[_caseNumber]._uintCase["Approvals"];
    }

    function getCasesWaitingForApproval()public view returns(uint[] memory){
        return _uintArrayStorage["WaitingForApproval"];
    }

    function getLimit(uint _caseNumber) public view returns(uint){
        return _cases[_caseNumber]._uintCase["Limit"];
    }

}