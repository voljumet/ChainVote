// // fetches the jsonfile with abi

// window.abi = "caseAbi.abi";

// var json = "../Backend/build/contracts/Case.json";
// var caseAbi = JSON.parse(json);
// window.abi = caseAbi.abi;

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
        indexed: true,
        internalType: "uint256",
        name: "caseNumber",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "openForVoting",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "stringAlt",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "uintAlt",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalVotes",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "region",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "confirmation",
        type: "string",
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
        internalType: "uint256",
        name: "numberOfUsers",
        type: "uint256",
      },
    ],
    name: "getUsers",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "confirmation",
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
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
        name: "_startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_alt1",
        type: "string",
      },
      {
        internalType: "string",
        name: "_alt2",
        type: "string",
      },
      {
        internalType: "string",
        name: "_alt3",
        type: "string",
      },
      {
        internalType: "string",
        name: "_alt4",
        type: "string",
      },
      {
        internalType: "string",
        name: "_alt5",
        type: "string",
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
    name: "getCase",
    outputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalVotes",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_startDateForVoting",
        type: "bool",
      },
      {
        internalType: "string[]",
        name: "_alt",
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
    name: "getAlt",
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
    name: "getApprovals",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_caseNumber",
        type: "uint256",
      },
    ],
    name: "getLimit",
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
];
