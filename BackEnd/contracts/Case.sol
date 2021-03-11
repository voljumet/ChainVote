//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Ownable.sol";

contract Case is Ownable {

    constructor() {
        initialize(msg.sender);
    }

    function initialize(address _owner) public {
        require(!_boolStorage[0]["initialized"]);
        _addressStorage[0]["owner"] = _owner;
        _boolStorage[0]["initialized"] = true;
    }

    event caseCreated(string title, bool openForVoting);
    event caseDeleted(string title, bool openForVoting, address deletedBy);
    event votingOpened(uint256 caseNumber, string title);
    event votingClosed(uint256 caseNumber, string title);

    function createCase(string memory _title, uint256 _deadline, uint256 _totalVotes) public onlyOwner {
        require(_totalVotes > 0, "Total votes needs to be more than 0");
        // "Global" Case Number Counter
        _uintStorage[0]["caseNumber"] = SafeMath.add(_uintStorage[0]["caseNumber"], 1);

        // This creates a case
        _stringStorage[ _uintStorage[0]["caseNumber"] ]["Title"] = _title;
        _uintStorage[_uintStorage[0]["caseNumber"]]["Deadline"] = _deadline;
        _uintStorage[_uintStorage[0]["caseNumber"]]["Total Votes"] = _totalVotes;
        _boolStorage[_uintStorage[0]["caseNumber"]]["open For Voting"] = false;

        //adding first alternative to Array and giving it all the votes
        _stringArrayStorage[_uintStorage[0]["caseNumber"]]["Alternatives"].push("Ikke Stemt");
        _uintArrayStorage[_uintStorage[0]["caseNumber"]]["Alternatives"].push(_totalVotes);

        // checks if the information that is going to be stored is the same as the information entered into the function
        assert(keccak256(abi.encodePacked(
                    _stringStorage[_uintStorage[0]["caseNumber"]]["Title"],
                    _uintStorage[_uintStorage[0]["caseNumber"]]["Deadline"],
                    _boolStorage[_uintStorage[0]["caseNumber"]]["Open For Voting"],
                    _uintStorage[_uintStorage[0]["caseNumber"]]["Total Votes"],
                    _stringArrayStorage[_uintStorage[0]["caseNumber"]]["Alternatives"][0],
                    _uintArrayStorage[_uintStorage[0]["caseNumber"]]["Alternatives"][0]
                ))
            ==
            keccak256(abi.encodePacked(
                    _title,
                    _deadline,
                    false,
                    _totalVotes,
                    "Ikke Stemt",
                    _totalVotes
                ))
        );
        emit caseCreated(_stringStorage[_uintStorage[0]["caseNumber"]]["Title"], _boolStorage[_uintStorage[0]["caseNumber"]]["Open For Voting"]);
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting, string[] memory _alternatives, uint[] memory _num){
        return (_stringStorage[_caseNumber]["Title"], _uintStorage[_caseNumber]["Deadline"], _uintStorage[_caseNumber]["Total Votes"], 
        _boolStorage[_caseNumber]["Open For Voting"], _stringArrayStorage[_caseNumber]["Alternatives"], _uintArrayStorage[_caseNumber]["Alternatives"]);
    }

    // Problematisk å slette?
    function deleteCase(uint _caseNumber) public onlyOwner {
        require(!_boolStorage[_caseNumber]["Open For Voting"]);

        delete _stringStorage[_caseNumber]["Title"];
        delete _uintStorage[_caseNumber]["Deadline"];
        delete _uintStorage[_caseNumber]["Total Votes"];
        delete _stringArrayStorage[_caseNumber]["Alternatives"];
        delete _addressStorage[_caseNumber]["Voted"];
        delete _boolStorage[_caseNumber]["Open For Voting"];

        emit caseDeleted(_stringStorage[_caseNumber]["Title"], _boolStorage[_caseNumber]["Open For Voting"], _addressStorage[0]["owner"]);
   }
   
   function addAlternatives(uint256 _caseNumber, string memory _alternative) public onlyOwner {
        _uintArrayStorage[_caseNumber]["Alternatives"].push(0);
        _stringArrayStorage[_caseNumber]["Alternatives"].push(_alternative);
        // Assert
   }

   function openVoting(uint256 _caseNumber) public onlyOwner {
        require(_uintStorage[_caseNumber]["Total Votes"] > 0);
        _boolStorage[_caseNumber]["Open For Voting"] = true;
        emit votingOpened(_caseNumber, _stringStorage[_caseNumber]["title"]);
   }
   
   function vote (uint256 _caseNumber, uint256 _optionVoted) public {
        // Checks if the case is open for voting
        require(_boolStorage[_caseNumber]["Open For Voting"], "Not Open For Voting Yet!");

        // Checks that the option exists
        require(_optionVoted <= _uintArrayStorage[_caseNumber]["Alternatives"].length, "Pick an option that exists");

        // Checks if the address already voted, then using changeVote instead
        if(_boolStorage[_caseNumber][string(abi.encodePacked(msg.sender))]) {
            changeVote(_caseNumber, _optionVoted);
        } else {
            _boolStorage[_caseNumber][string(abi.encodePacked(msg.sender))] = true; // Voting address registerd to the case
            _uintStorage[_caseNumber][string(abi.encodePacked(msg.sender))] = _optionVoted; // Register alternative to address
            _uintArrayStorage[_caseNumber]["Alternatives"][0] = SafeMath.sub(_uintArrayStorage[_caseNumber]["Alternatives"][0], 1); // subtracts a Vote from "Ikke Stemt" 
            _uintArrayStorage[_caseNumber]["Alternatives"][_optionVoted] = SafeMath.add(_uintArrayStorage[_caseNumber]["Alternatives"][_optionVoted], 1); //adds a vote to the option chosen
        }
            // assert changes has to be done, no need if no transaction
   }

   function changeVote(uint256 _caseNumber, uint256 _optionVoted) internal {
        uint256 registerdVote = _uintStorage[_caseNumber][string(abi.encodePacked(msg.sender))];
        _uintStorage[_caseNumber][string(abi.encodePacked(msg.sender))] = _optionVoted; // Register alternative to address
        _uintArrayStorage[_caseNumber]["Alternatives"][registerdVote] = SafeMath.sub(_uintArrayStorage[_caseNumber]["Alternatives"][registerdVote], 1); // subtracts a Vote from previously voted alternative
        _uintArrayStorage[_caseNumber]["Alternatives"][_optionVoted] = SafeMath.add(_uintArrayStorage[_caseNumber]["Alternatives"][_optionVoted], 1); //adds a vote to the option chosen
   }

   function getAlternatives(uint256 _caseNumber) public view returns(string[] memory, uint256[] memory){
        return (_stringArrayStorage[_caseNumber]["Alternatives"], _uintArrayStorage[_caseNumber]["Alternatives"]);
   }

   function getMyVote(uint256 _caseNumber) public view returns(string memory){
        return (_stringArrayStorage[_caseNumber]["Alternatives"][_uintStorage[_caseNumber][string(abi.encodePacked(msg.sender))]]);
   }
 
}