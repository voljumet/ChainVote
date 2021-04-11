window.abi =[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "caseNumber",
        "type": "uint256"
      }
    ],
    "name": "SigningRequestE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "stringAlt",
        "type": "string[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "uintAlt",
        "type": "uint256[]"
      }
    ],
    "name": "addApprovalsE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "numberOfApprovals",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "approvalsE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "caseNumber",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "caseApprovedE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "casesWaitingForApproval",
        "type": "uint256[]"
      }
    ],
    "name": "casesWaitingForApprovalE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "confirmation",
        "type": "bool"
      }
    ],
    "name": "confirmationE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "caseNumber",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "openForVoting",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "stringAlt",
        "type": "string[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "uintAlt",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalVotes",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "region",
        "type": "string"
      }
    ],
    "name": "getCaseE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "region",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "userType",
        "type": "string"
      }
    ],
    "name": "getUserE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "usersWithSameRegionAndUserType",
        "type": "uint256"
      }
    ],
    "name": "getUsersE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "votedAlternative",
        "type": "string"
      }
    ],
    "name": "myVoteE",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "toalVotes",
        "type": "uint256"
      }
    ],
    "name": "totalVotesE",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_caseNumber",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "createMultisigInstance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "signMultisigInstance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_region",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_userType",
        "type": "string"
      }
    ],
    "name": "createUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_caseNumber",
        "type": "uint256"
      }
    ],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_caseNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_alternative",
        "type": "string"
      }
    ],
    "name": "addAlternatives",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_alt1",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_alt2",
        "type": "string"
      }
    ],
    "name": "createCase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_caseNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_optionVoted",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_caseNumber",
        "type": "uint256"
      }
    ],
    "name": "getMyVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_caseNumber",
        "type": "uint256"
      }
    ],
    "name": "getApprovalsAndLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
