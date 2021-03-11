//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
pragma abicoder v2;

import "./Ownable.sol";

contract Case is Ownable {

    constructor() {
        initialize(msg.sender);
    }

    function initialize(address _owner) private {
        require(!_boolStorage["initialized"]);
        _addressStorage["owner"] = _owner;
        _boolStorage["initialized"] = true;
    }

    event caseCreated(string title, bool openForVoting);
    event caseDeleted(string title, bool openForVoting);
    event votingOpened(uint256 caseNumber, string title);
    event votingClosed(uint256 caseNumber, string title);

    function createCase(string memory _title, uint256 _deadline, uint256 _totalVotes) public onlyOwner {
        require(_totalVotes > 0, "Total votes needs to be more than 0");
        // "Global" Case Number Counter
        _uintStorage["caseNumber"] = SafeMath.add(_uintStorage["caseNumber"], 1);
        uint caseNumber = _uintStorage["caseNumber"];

        // This creates a case
        _cases[caseNumber]._stringCase["Title"] = _title;
        _cases[caseNumber]._uintCase["Deadline"] = _deadline;
        _cases[caseNumber]._uintCase["Total Votes"] = _totalVotes;
        _cases[caseNumber]._boolCase["open For Voting"] = false;

        //adding first alternative to Array and giving it all the votes
        _cases[caseNumber]._stringArrayCase["Alternatives"].push("Ikke Stemt");
        _cases[caseNumber]._uintArrayCase["Alternatives"].push(_totalVotes);

        // checks if the information that is going to be stored is the same as the information entered into the function
        assert(keccak256(abi.encodePacked(
                    _cases[caseNumber]._stringCase["Title"],
                    _cases[caseNumber]._uintCase["Deadline"],
                    _cases[caseNumber]._boolCase["open For Voting"],
                    _cases[caseNumber]._uintCase["Total Votes"],
                    _cases[caseNumber]._stringArrayCase["Alternatives"][0],
                    _cases[caseNumber]._uintArrayCase["Alternatives"][0]
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
        emit caseCreated(_cases[caseNumber]._stringCase["Title"], _cases[caseNumber]._boolCase["Open For Voting"]);
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting, string[] memory _alternatives, uint[] memory _num){
        return (_cases[_caseNumber]._stringCase["Title"], _cases[_caseNumber]._uintCase["Deadline"], _cases[_caseNumber]._uintCase["Total Votes"], 
        _cases[_caseNumber]._boolCase["Open For Voting"], _cases[_caseNumber]._stringArrayCase["Alternatives"], _cases[_caseNumber]._uintArrayCase["Alternatives"]);
    }

    // Problematisk å slette?
    function deleteCase(uint _caseNumber) public onlyOwner {
        require(!_cases[_caseNumber]._boolCase["Open For Voting"]);

        delete _cases[_caseNumber]._stringCase["Title"];
        delete _cases[_caseNumber]._uintCase["Deadline"];
        delete _cases[_caseNumber]._uintCase["Total Votes"];
        delete _cases[_caseNumber]._stringArrayCase["Alternatives"];
        delete _cases[_caseNumber]._boolCase["Open For Voting"];

        emit caseDeleted(_cases[_caseNumber]._stringCase["Title"], _cases[_caseNumber]._boolCase["Open For Voting"]);
   }
   

   function addAlternatives(uint256 _caseNumber, string memory _alternative) public onlyOwner {
        require(!_cases[_caseNumber]._boolCase["Open For Voting"]); //also require multiSig = 0 signatures
        uint256 temp1 = _cases[_caseNumber]._stringArrayCase["Alternatives"].length;
        uint256 temp2 = _cases[_caseNumber]._uintArrayCase["Alternatives"].length;

        _cases[_caseNumber]._uintArrayCase["Alternatives"].push(0);
        _cases[_caseNumber]._stringArrayCase["Alternatives"].push(_alternative);
        
        assert(_cases[_caseNumber]._uintArrayCase["Alternatives"][temp1] == 0);
        assert(keccak256(abi.encodePacked(
                    _cases[_caseNumber]._stringArrayCase["Alternatives"][temp1],
                    _cases[_caseNumber]._stringArrayCase["Alternatives"].length,
                    _cases[_caseNumber]._uintArrayCase["Alternatives"].length
                ))
            == keccak256(abi.encodePacked(
                    _alternative,
                    temp1+1,
                    temp2+1
                ))
        );
   }

   function openVoting(uint256 _caseNumber) public onlyOwner {
        require(_cases[_caseNumber]._uintCase["Total Votes"] > 0);
        _cases[_caseNumber]._boolCase["Open For Voting"] = true;
        emit votingOpened(_caseNumber, _cases[_caseNumber]._stringCase["title"]);
   }
   
   function vote (uint256 _caseNumber, uint256 _optionVoted) public {
        require(_cases[_caseNumber]._boolCase["Open For Voting"], "Not Open For Voting Yet!");  // Checks if the case is open for voting
        require(_optionVoted <= _cases[_caseNumber]._uintArrayCase["Alternatives"].length, "Pick an option that exists");   // Checks that the option exists

        uint256 oldVote = _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))];

        // Checks if the address already voted, then using changeVote instead
        if(_cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))]) {
            changeVote(_caseNumber, _optionVoted);
        } else {
            firstVote(_caseNumber, _optionVoted);
        }

        assert(_optionVoted != oldVote);
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

   function firstVote(uint256 _caseNumber, uint256 _optionVoted) internal {
        _cases[_caseNumber]._boolCase[string(abi.encodePacked(msg.sender))] = true; // Voting address registerd to the case
        _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] = _optionVoted; // Register alternative to address
        _cases[_caseNumber]._uintArrayCase["Alternatives"][0] = SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alternatives"][0], 1); // subtracts a Vote from "Ikke Stemt" 
        _cases[_caseNumber]._uintArrayCase["Alternatives"][_optionVoted] = SafeMath.add(_cases[_caseNumber]._uintArrayCase["Alternatives"][_optionVoted], 1); //adds a vote to the option chosen
   }

   function changeVote(uint256 _caseNumber, uint256 _optionVoted) internal {
        uint256 registerdVote = _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))];
        _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] = _optionVoted;     // Register alternative to address
        _cases[_caseNumber]._uintArrayCase["Alternatives"][registerdVote] = SafeMath.sub(_cases[_caseNumber]._uintArrayCase["Alternatives"][registerdVote], 1);     // subtracts a Vote from previously voted alternative
        _cases[_caseNumber]._uintArrayCase["Alternatives"][_optionVoted] = SafeMath.add(_cases[_caseNumber]._uintArrayCase["Alternatives"][_optionVoted], 1);   //adds a vote to the option chosen
   }

   function getAlternatives(uint256 _caseNumber) public view returns(string[] memory, uint256[] memory){
        return (_cases[_caseNumber]._stringArrayCase["Alternatives"], _cases[_caseNumber]._uintArrayCase["Alternatives"]);
   }

   function getMyVote(uint256 _caseNumber) public view returns(string memory){
        return ( _cases[_caseNumber]._stringArrayCase["Alternatives"][ _cases[_caseNumber]._uintCase[string(abi.encodePacked(msg.sender))] ] );
   }
 
}