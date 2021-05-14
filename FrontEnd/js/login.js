function reloadUrl() {
  if (location.hash == '#runLogOut') {
    logOut();
  }
  location.hash = '';
}

init = async () => {
  window.web3 = await Moralis.Web3.enable();

  initUser();
};
initUser = async () => {
  user = await Moralis.User.current();
  if (user) {
      hideElment(userConnectButton);
     showElment(userProfileButton);
     showElment(document.getElementById('logout'));
    UserNameFront.innerText = user.get('username');
    window.onload = function () {
      if (!window.location.hash) {
        console.log('wwerwer');
        window.location = window.location + '#loaded';
        window.location.reload();
      }
    };
  } else {
     showElment(userConnectButton);
     hideElment(userProfileButton);
     hideElment(document.getElementById('logout'));
    UserNameFront.innerText = '';
  }
};

login = async () => {
  try {
    await Moralis.Web3.authenticate();
    showSuccessAlert('You have been sigend in successfully');
    disaprearAlert(2000);
    initUser();
  } catch (error) {
    showErrorAlert('Canceled');
    disaprearAlert(2000);
  }
};

logOut = async () => {
  await Moralis.User.logOut();
   hideElment(userInfo);
  showSuccessAlert('You have been loged out successfully');
  disaprearAlert(2000);
  initUser();
};

openUerInfo = async () => {
  user = await Moralis.User.current();
  if (user) {
    const email = user.get('Email');
    UserNameFront.innerText = user.get('username');
    if (email) {
      userEmailField.value = email;
    } else {
      userEmailField.value = '';
      userNameField.value = '';
      userTypeField.value = '';
      userRegionField.value = '';
    }

    userNameField.value = user.get('username');
    userRegionField.value = user.get('Region');
    userTypeField.value = user.get('UserType');

     showElment(userInfo);
     hideElment(userProfileButton);
  } else {
    login();
  }
};

saveUserInfo = async () => {
  try {
    await createUser(userRegionField.value, userTypeField.value);
  } catch (error) {
    showErrorAlert('Canceled');
    disaprearAlert(2000);
  }
};

async function createUser(_region, _userType) {
  if (confirm('Region: ' + _region + '\nUserType: ' + _userType)) {
    window.web3 = await Moralis.Web3.enable();
    let abi = [
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
    let contractInstance = new web3.eth.Contract(abi, contractAddress);

    contractInstance.methods
      .createUser(_region, _userType)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {
        if (receipt.events.confirmationE.returnValues.confirmation) {
          showSuccessAlert('user created successfully');
          disaprearAlert(2000);
          user.set('UserType', userTypeField.value);
          user.set('username', userNameField.value);
          user.set('Region', userRegionField.value);
          user.set('Email', userEmailField.value);
          await user.save();
          openUerInfo();
        }
      });
  } else {
    showErrorAlert('Canceled');
    disaprearAlert(2000);
  }
}

closeButton = async () => {
   hideElment(userInfo);
   showElment(userProfileButton);
};

function disaprearAlert(after) {
  window.setTimeout(function () {
    $('#alert').hide('fade');
  }, after);
}

function showErrorAlert(message) {
  $('#alert').html(
    "<div class='alert alert-danger' role='alert'>" +
      '<strong>Error! </strong>' +
      message +
      '</div>'
  );
  $('#alert').show();
}
function showSuccessAlert(message) {
  $('#alert').html(
    "<div class='alert alert-success' role='alert'>" +
      '<strong>Success! </strong>' +
      message +
      '</div>'
  );
  $('#alert').show();
}
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});

hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

const userConnectButton = document.getElementById('connect');
userConnectButton.onclick = login;
const userProfileButton = document.getElementById('userinfobutton');
userProfileButton.onclick = openUerInfo;

document.getElementById('closeInfo').onclick = closeButton;
document.getElementById('logout').onclick = logOut;
document.getElementById('save').onclick = saveUserInfo;

const userInfo = document.getElementById('userinfo');
const UserNameFront = document.getElementById('userNameFront');

const userEmailField = document.getElementById('email-input');
const userNameField = document.getElementById('username-input');
const userTypeField = document.getElementById('usertype-input');
const userRegionField = document.getElementById('region-input');

window.location.href.split('#')[0];
console.log(window.location.href);
init();

Moralis.Web3.onAccountsChanged(function (accounts) {
  var user = Moralis.User.current();
  if (user) {
    logOut();
  }
});
reloadUrl();
