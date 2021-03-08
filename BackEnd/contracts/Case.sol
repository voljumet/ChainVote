// SPDX-License-Identifier: MIT
import "./Ownable.sol";
import "./safeMath.sol";
pragma solidity 0.7.5;
pragma abicoder v2;


contract Cases is Ownable{

    struct Case {
      uint id;
      string title;
      string option1;
      uint deadline;
      uint totalVotes;
      bool openForVoting;
      string[] alternativesString;
    }
    uint private caseNumber;

    // 1. case title, 2. caseNumber. -- mapping to search cases in frontend
    mapping(string => uint) caseIndexRegister;
    
    // 1. caseNumber, 2. alternativeText, 3. alternativesVotes. -- mapping caseNumber to alternatives.
    mapping(uint => mapping(string => uint)) caseAlternatives;

    event caseCreated(string title, bool openForVoting);
    event caseDeleted(string title, bool openForVoting, address deletedBy);

    // uint public balance;

    modifier costs(uint _cost){
        require(msg.value >= _cost);
        _;
    }

    mapping (uint => Case) private cases;
    address[] private creators;

    function createCase(string memory _title, uint _deadline, uint _totalVotes) public onlyOwner {
      require(_totalVotes > 0, "Total votes needs to be more than 0");

        //This creates a case
        Case memory newCase;
        newCase.title = _title;
        newCase.deadline = _deadline;
        newCase.totalVotes = _totalVotes;

        caseNumber = SafeMath.add(caseNumber, 1);

        insertCase(newCase, caseNumber, _totalVotes);
        creators.push(msg.sender);
        
        assert(
            keccak256(
                abi.encodePacked(
                    cases[caseNumber].title,
                    cases[caseNumber].deadline,
                    cases[caseNumber].totalVotes,
                    cases[caseNumber].openForVoting
                )
            )
            ==
            keccak256(
                abi.encodePacked(
                    newCase.title,
                    newCase.deadline,
                    newCase.totalVotes,
                    newCase.openForVoting
                )
            )
        );
        emit caseCreated(newCase.title, newCase.openForVoting);
    }
    function insertCase(Case memory _newCase, uint _caseNumber, uint _totalVotes) private {
        cases[_caseNumber] = _newCase;
        addAlternatives(_caseNumber, "Ikke Stemt");
        caseAlternatives[_caseNumber]["Ikke Stemt"] = _totalVotes;
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting, string[] memory _alternatives, uint[10] memory _num){
        uint[10] memory votesArray;
        for(uint i = 0; i <=  cases[_caseNumber].alternativesString.length-1; i++){
            votesArray[i] = caseAlternatives[_caseNumber][cases[_caseNumber].alternativesString[i]];
        }
        
        return (cases[_caseNumber].title, cases[_caseNumber].deadline, cases[_caseNumber].totalVotes, 
        cases[_caseNumber].openForVoting, cases[_caseNumber].alternativesString, votesArray);
    }
    function deleteCase(uint _caseNumber) public onlyOwner {
      string memory title = cases[_caseNumber].title;
      bool openForVoting = cases[_caseNumber].openForVoting;

       delete cases[_caseNumber];
       emit caseDeleted(title, openForVoting, owner);
   }
   function getCreator(uint _index) public view onlyOwner returns(address){
       return creators[_index];
   }
   
   function addAlternatives(uint _caseNumber, string memory _alternative) public{
       caseAlternatives[_caseNumber][_alternative] = 0;
       cases[_caseNumber].alternativesString.push(_alternative);
   }
   
   function Vote (uint _caseNumber, uint _optionVoted) public{
       caseAlternatives[_caseNumber]["Ikke Stemt"] = SafeMath.sub(caseAlternatives[_caseNumber]["Ikke Stemt"], 1);
       caseAlternatives[_caseNumber][cases[_caseNumber].alternativesString[_optionVoted]] = 
            SafeMath.add(caseAlternatives[_caseNumber][cases[_caseNumber].alternativesString[_optionVoted]], 1);
   }
 
}