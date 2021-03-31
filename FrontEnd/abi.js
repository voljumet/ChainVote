window.abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_approvals",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_approver",
        type: "address",
      },
    ],
    name: "ApprovalReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "CaseApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "CloseVoting",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "SigningRequestCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "openForVoting",
        type: "bool",
      },
    ],
    name: "caseCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "openForVoting",
        type: "bool",
      },
    ],
    name: "caseDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "userCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "caseNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
    ],
    name: "votingClosed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "caseNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
    ],
    name: "votingOpened",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_region",
        type: "string",
      },
      {
        internalType: "string",
        name: "_userType",
        type: "string",
      },
    ],
    name: "createUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "endVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_open",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_close",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "_alternatives",
        type: "string[]",
      },
    ],
    name: "createCase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getCase",
    outputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_close",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalVotes",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_openForVoting",
        type: "bool",
      },
      {
        internalType: "string[]",
        name: "_alternatives",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "_num",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "deactivateCase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_optionVoted",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getCaseResult",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getAlternatives",
    outputs: [
      {
        internalType: "string[]",
        name: "_alter",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "_alterNum",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getMyVote",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_region",
        type: "string",
      },
      {
        internalType: "string",
        name: "_userType",
        type: "string",
      },
    ],
    name: "getUserArrayLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "approveCase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getApprovalLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getTotalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getApprovalZ",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getCasesWaitingForApproval",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
