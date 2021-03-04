import "./Ownable.sol";
pragma solidity 0.5.12;

contract Cases is Ownable{

    struct Case {
      uint id;
      string title;
      mapping(string => uint) alternativeCounter;
      uint deadline;
      uint totalVotes;
      bool openForVoting;
    }
    uint caseNumber;

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
        caseNumber++;

        insertCase(newCase, caseNumber);
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
    function insertCase(Case memory _newCase, uint _caseNumber) private {
        cases[_caseNumber] = _newCase;
    }

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting){
        return (cases[_caseNumber].title, cases[_caseNumber].deadline, cases[_caseNumber].totalVotes, cases[_caseNumber].openForVoting);
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
}