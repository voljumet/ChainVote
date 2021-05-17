// Testnet
Moralis.initialize("V72IuyWsaYclkUWnzU7JdLkfSZqyArobvyU4OKOg"); // Application id from moralis.io
Moralis.serverURL = "https://03i7vk4ziens.moralis.io:2053/server"; //Server url from moralis.io

// Local
//Moralis.initialize("2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj"); // Application id from moralis.io
//Moralis.serverURL = "https://rnonp7vwlz3d.moralis.io:2053/server"; //Server url from moralis.io

window.CaseAbi = [
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
        "name": "signingRequestE",
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
window.ProxyAbi = [
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_superAdminArray",
                "type": "address[]"
            },
            {
                "internalType": "string",
                "name": "_region",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "instanceInProgress",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "pauseStarted",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "upgradeStarted",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "approvalsNeeded",
                "type": "uint256"
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
                "internalType": "bool",
                "name": "paused",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pauseTimer",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "functionContractAddress",
                "type": "address"
            }
        ],
        "name": "confirmationE",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback",
        "payable": true
    },
    {
        "inputs": [],
        "name": "signMultisigInstance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newAddress",
                "type": "address"
            }
        ],
        "name": "upgrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unPause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
window.MultiAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "instanceInProgress",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "pauseStarted",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "upgradeStarted",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "approvalsNeeded",
                "type": "uint256"
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
                "internalType": "bool",
                "name": "paused",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "pauseTimer",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "functionContractAddress",
                "type": "address"
            }
        ],
        "name": "confirmationE",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "signMultisigInstance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// function getAbi() {
//     return new Promise((res) => {
//         $.getJSON("../Backend/build/contracts/Case.json", ((json) => {
//             res(json.abi);
//         }))
//     })
// }

// function getProxyAbi() {
//     return new Promise((res) => {
//         $.getJSON("../Backend/build/contracts/Proxy.json", ((json) => {
//             res(json.abi);
//         }))
//     })
// }

// function getMultiAbi() {
//     return new Promise((res) => {
//         $.getJSON("../Backend/build/contracts/MultiSig.json", ((json) => {
//             res(json.abi);
//         }))
//     })
// }
