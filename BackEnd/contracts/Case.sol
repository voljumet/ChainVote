// SPDX-License-Identifier: MIT
import "./Ownable.sol";
import "./safeMath.sol";
import "./Storage.sol";

pragma solidity 0.7.5;
pragma abicoder v2;


contract Cases is Ownable, Storage {

    constructor() {
        initialize(msg.sender);
    }

    function initialize(address _owner) public {
        require(!_initialized);
        owner = _owner;
        _initialized = true;
    }

    event caseCreated(string title, bool openForVoting);
    event caseDeleted(string title, bool openForVoting, address deletedBy);

    // modifier costs(uint _cost){
    //     require(msg.value >= _cost);
    //     _;
    // }

    function createCase(string memory _title, uint256 _deadline, uint256 _totalVotes) public onlyOwner {
      require(_totalVotes > 0, "Total votes needs to be more than 0");
        caseNumber = SafeMath.add(caseNumber, 1);
        string memory firstAlternative = "Ikke Stemt";

        //This creates a case
        _stringStorage[caseNumber]["Title"] = _title;
        _uintStorage[caseNumber]["Deadline"] = _deadline;
        _uintStorage[caseNumber]["Total Votes"] = _totalVotes;
        _boolStorage[caseNumber]["open For Voting"] = false;

        //adding first alternative to Array and giving it all the votes
        _stringArrayStorage[caseNumber]["Alternatives"].push(firstAlternative);
        _uintStorage[caseNumber]["Ikke Stemt"] = _totalVotes;


        // Was is das?
        _addressStorage[caseNumber]["Creator"] = msg.sender;

        
        // checks if the information that is going to be stored is the same as the information entered into the function
        assert(
            keccak256(
                abi.encodePacked(
                    _stringStorage[caseNumber]["Title"],
                    _uintStorage[caseNumber]["Deadline"],
                    _uintStorage[caseNumber]["Total Votes"],
                    _boolStorage[caseNumber]["Open For Voting"],
                    _stringArrayStorage[caseNumber]["Alternatives"][0],
                    _uintStorage[caseNumber]["Ikke Stemt"]
                )
            )
            ==
            keccak256(
                abi.encodePacked(
                    _title,
                    _deadline,
                    _totalVotes,
                    false,
                    firstAlternative,
                    _totalVotes
                )
            )
        );
        emit caseCreated(_stringStorage[caseNumber]["Title"], _boolStorage[caseNumber]["Open For Voting"]);
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting, string[] memory _alternatives, uint[10] memory _num){
        uint[10] memory votesArray;

        for(uint i = 0; i <= _stringArrayStorage[_caseNumber]["Alternatives"].length-1; i++){
            votesArray[i] = _uintStorage[_caseNumber][_stringArrayStorage[_caseNumber]["Alternatives"][i]];
        }
        
        return (_stringStorage[_caseNumber]["Title"], _uintStorage[_caseNumber]["Deadline"], _uintStorage[_caseNumber]["Total Votes"], 
        _boolStorage[caseNumber]["Open For Voting"], _stringArrayStorage[_caseNumber]["Alternatives"], votesArray);
    }
    function deleteCase(uint _caseNumber) public onlyOwner {
        require(!_boolStorage[_caseNumber]["Open For Voting"]);
        string memory title = _stringStorage[_caseNumber]["Title"];
        bool openForVoting = _boolStorage[_caseNumber]["Open For Voting"];

        delete _stringStorage[_caseNumber]["Title"];
        delete _uintStorage[_caseNumber]["Deadline"];
        delete _uintStorage[_caseNumber]["Total Votes"];
        delete _stringArrayStorage[_caseNumber]["Alternatives"];
        delete _addressStorage[_caseNumber]["Voted"];
        delete _boolStorage[_caseNumber]["Open For Voting"];

        emit caseDeleted(title, openForVoting, owner);
   }
// ---------------------------------------------------------------------------------
//    /// TRENGER VI DENNE?
//    function getCreator(uint _index) public view onlyOwner returns(address){
//        _addressStorage[caseNumber]["Creator"] = msg.sender;
//     //    return creators[_index];
//    }
// ---------------------------------------------------------------------------------
   
   function addAlternatives(uint256 _caseNumber, string memory _alternative) public onlyOwner {
        _uintStorage[_caseNumber][_alternative] = 0;
        _stringArrayStorage[_caseNumber]["alternative"].push(_alternative);
   }

   function openVoting(uint256 _caseNumber) public onlyOwner {
        _boolStorage[_caseNumber]["Open For Voting"] = true;
   }
   
   function Vote (uint256 _caseNumber, string memory _optionVoted) public {
        // 1. Checks if the case is open for voting, 2. Checks if the address has already voted on the case
        require(_boolStorage[_caseNumber]["Open For Voting"] && !_boolStorage[_caseNumber][string(abi.encodePacked(msg.sender))]);
        _boolStorage[_caseNumber][string(abi.encodePacked(msg.sender))] = true;

        _uintStorage[_caseNumber]["Ikke Stemt"] = SafeMath.sub(_uintStorage[_caseNumber]["Ikke Stemt"], 1);

        // Må sjekke at _optionVoted faktisk er et alternativ zzzzzzzzzzzzzz<<<<<<<<<<<<<<zzzzzzzzzzzz
        _uintStorage[_caseNumber][_optionVoted] = SafeMath.add(_uintStorage[_caseNumber][_optionVoted], 1);
        // Må sjekke at _optionVoted faktisk er et alternativ zzzzzzzzzzzzzz<<<<<<<<<<<<<<zzzzzzzzzzzz
   }

   function getAlternatives(uint256 _caseNumber) public returns(string[] memory){
       return _stringArrayStorage[_caseNumber]["Alternatives"];
   }
 
}