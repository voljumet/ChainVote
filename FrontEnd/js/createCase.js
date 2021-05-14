
// createCase
async function createCase( _title, _description, _startDate, _endDate, alt1, alt2) {
  try {
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
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(abi, contractAddress);
    contractInstance.methods
      .createCase( _title, _description, _startDate / 1000, _endDate / 1000, alt1, alt2)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {
        console.log('This is receipt:' + receipt);
        if (receipt.events.confirmationE.returnValues.confirmation) {
          showSuccessAlert('Case Created Successfully');
          disaprearAlert(2000);
          document.getElementById('title').value = receipt.events.getCaseE.returnValues.title;
          document.getElementById('title').disabled = true;
          document.getElementById('description').value = receipt.events.getCaseE.returnValues.description;
          document.getElementById('description').disabled = true;
          document.getElementById('alternatives1').value = receipt.events.getCaseE.returnValues.stringAlt[1];
          document.getElementById('alternatives1').disabled = true;
          document.getElementById('alternatives2').value = receipt.events.getCaseE.returnValues.stringAlt[2];
          document.getElementById('alternatives2').disabled = true;
          // hideElment(document.getElementById('create-button'));
          redirect(receipt.events.getCaseE.returnValues.caseNumber);
        } else {
          showErrorAlert('Failed');
          disaprearAlert(2000);
        }
      });
  } catch (error) {
    showErrorAlert('Failed');
    disaprearAlert(2000);
  }
}

document.getElementById('create-button').onclick = function () {
  createCase(
    document.getElementById('title').value,
    document.getElementById('description').value,
    (document.getElementById('startDate').innerHTML = new Date( $('#startDate').val() ).getTime()),
    (document.getElementById('endDate').innerHTML = new Date( $('#endDate').val() ).getTime()),
    document.getElementById('alternatives1').value,
    document.getElementById('alternatives2').value
  );
};

$('#startDate').datetimepicker({
  timepicker: true,
  datepicker: true,
  minDate: new Date(),
  format: 'Y-m-d H:i',
  onShow: function (ct) {
    this.setOptions({
      maxDate: $('#endDate').val() ? $('#endDate').val() : false,
    }),
      console.log($('#startDate').val());
  },
});
$('#endDate').datetimepicker({
  timepicker: true,
  datepicker: true,
  format: 'Y-m-d H:i',
  onShow: function (ct) {
    this.setOptions({
      minDate: $('#startDate').val() ? $('#startDate').val() : false,
    });
  },
});

async function checkUserType() {
  user = await Moralis.User.current();
  console.log('user: ' + user);
  if (!user) {
    alert('Please Log in');
    location.href = 'login.html' + location.hash;
  }
  if (user.get('UserType') == 'Standard') {
    location.href = 'accessDenied.html';
  }
}

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

Moralis.Web3.onAccountsChanged(function (accounts) {
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});

window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});


function redirect(_caseNum) {
  location.href = 'addAlternatives.html?id' + _caseNum;
}


hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');


checkUserType();
