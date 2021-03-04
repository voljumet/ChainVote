import "./Ownable1.sol";
import "./safeMath.sol";
pragma solidity 0.7.5;
pragma abicoder v2;


contract Cases is Ownable{

    struct Case {
      uint id;
      string title;
      string option1;
      string option2;
      string option3;
      
      // alternativeCounter["Ja"] = 0
      // mapping(string => uint) alternativeCounter;
      uint deadline;
      uint totalVotes;
      bool openForVoting;
      string[] alternativesSting;
    }
    uint private caseNumber ;
    
    // 1. caseNumber, 2. alternativeText, 3. alternativesVotes. map _caseNumber to alternatives.
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

    function getCase(uint _caseNumber) public view returns(string memory _title, uint _deadline, uint _totalVotes, bool _openForVoting, string[] memory _votes, uint[10] memory _num){
        uint[10] memory votesArray;
        for(uint i = 0; i <=  cases[_caseNumber].alternativesSting.length-1; i++){
            votesArray[i] = caseAlternatives[_caseNumber][cases[_caseNumber].alternativesSting[i]];
        }
        
        return (cases[_caseNumber].title, cases[_caseNumber].deadline, cases[_caseNumber].totalVotes, cases[_caseNumber].openForVoting, cases[_caseNumber].alternativesSting, votesArray);
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
   
   function addAlternatives(uint _caseNumber, string memory _option1) public{
       caseAlternatives[_caseNumber][_option1] = 0;
      cases[_caseNumber].alternativesSting.push(_option1);
      
   }
   
   function Vote (uint _caseNumber, uint _optionVoted) public{
       
         caseAlternatives[_caseNumber]["Ikke Stemt"] = SafeMath.sub(caseAlternatives[_caseNumber]["Ikke Stemt"], 1);
         caseAlternatives[_caseNumber][cases[_caseNumber].alternativesSting[_optionVoted]] = SafeMath.add(caseAlternatives[_caseNumber][cases[_caseNumber].alternativesSting[_optionVoted]], 1);
           
     
   }
   
  




   
}