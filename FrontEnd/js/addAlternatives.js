const tabele = document.getElementsByClassName('case-details')[0];

function globaNumber() {
  var url = new URL(window.location.href).href;
  return url.substring(url.lastIndexOf('d') + 1);
}

var globalCaseNumber = globaNumber();

async function getNewCaseNumber(_caseNumber) {
  hideElment(document.getElementById('n1'));
  var num = _caseNumber;
  var myObject = { proposal_number: num };
  w3.displayObject('id03', myObject);
  showElment(document.getElementById('n2'));
}

// createCase
async function getCaseInfo(_caseNumber) {
  let reuslt = await Moralis.Cloud.run('Cases', {});
  reuslt.forEach((element) => {
    if (element.attributes.caseNumber == _caseNumber) {
      getNewCaseNumber(_caseNumber);
      document.getElementById('title').value = element.attributes.title;
      document.getElementById('title').disabled = true;

      document.getElementById('description').value =
        element.attributes.description;
      document.getElementById('description').disabled = true;

      tabele.appendChild(showCase(element.attributes.stringAlt));

      var start = new Date(element.attributes.startDate * 1000);
      console.log(start);
      document.getElementById('startDate').value =
        start.getDate() +
        '/' +
        (start.getMonth() + 1) +
        '/' +
        start.getFullYear() +
        ' ' +
        start.getHours() +
        ':' +
        start.getMinutes() +
        +start.getSeconds();
      document.getElementById('startDate').disabled = true;

      var end = new Date(element.attributes.endDate * 1000);
      document.getElementById('endDate').value =
        end.getDate() +
        '/' +
        (end.getMonth() + 1) +
        '/' +
        end.getFullYear() +
        ' ' +
        end.getHours() +
        ':' +
        end.getMinutes() +
        +end.getSeconds();
      document.getElementById('endDate').disabled = true;
    }
  });
}

function showCase(_stringAlternatives) {
  const cardy = document.createElement('div');

  for (let i = 0; i < _stringAlternatives.length; i++) {
    const alts = document.createElement('input');
    alts.value = _stringAlternatives[i];
    alts.className = 'form-control';
    alts.type = 'text';
    alts.disabled = true;
    cardy.append(alts);
  }
  return cardy;
}

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
  //hideElment(document.getElementById("add-alt-button"));
  hideElment(addAltButton);
  user = await Moralis.User.current();
  console.log('Sa:' + user);
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
  // window.location.replace("http://www.w3schools.com");
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  loader.className += ' hidden';
});

var counter = 1;
function addInput() {
  //showElment(document.getElementById("ddNewAlt-button"))
  var newdiv = document.createElement('div');
  newdiv.id = 'input' + counter;
  newdiv.innerHTML =
    "<div class='input-group mb-3'><input id= alt" +
    counter +
    "  class='form-control' type='text' placeholder='Alternative Text' name='myInputs[]'> <div id= 'delete-alt-button' type='button' value='-' onClick='removeInput(" +
    counter +
    ");'>-</div> </div> ";
  document.getElementById('formulario').appendChild(newdiv);
  counter++;
  hideElment(document.getElementById('add-alt-button'));
  showElment(addAltButton);
}

function removeInput(id) {
  var elem = document.getElementById('input' + id);
  hideElment(addAltButton);
  showElment(document.getElementById('add-alt-button'));
  return elem.parentNode.removeChild(elem);
}

async function addAlternative(id) {
  try {
    var altValue = document.getElementById('alt' + id).value;
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

    await contractInstance.methods
      .addAlternatives(globalCaseNumber, altValue)
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {
        if (receipt.events.addApprovalsE.returnValues.stringAlt) {
          showSuccessAlert('user created successfully');
          disaprearAlert(2000);
          await updateMoralis(
            globalCaseNumber,
            receipt.events.addApprovalsE.returnValues.uintAlt,
            receipt.events.addApprovalsE.returnValues.stringAlt
          );
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

async function updateMoralis(_caseNum, _uinttArray, _stringArray) {
  let reuslt = await Moralis.Cloud.run('Cases', {});
  let ID;
  reuslt.forEach((element) => {
    if (element.attributes.caseNumber == _caseNum) ID = element.id;
  });
  const CaseOne = Moralis.Object.extend('Cases');
  const TheCase = new CaseOne();

  TheCase.set('objectId', ID);
  TheCase.save().then((variable) => {
    variable.set('uintAlt', _uinttArray);
    variable.set('stringAlt', _stringArray);
    return variable.save();
  });
  timedRefresh(1000);
}
function timedRefresh(timeoutPeriod) {
  setTimeout('location.reload(true);', timeoutPeriod);
}

document.getElementById('add-alt-button').onclick = addInput;
const addAltButton = document.getElementById('addNewAlt-button');
addAltButton.onclick = function () {
  addAlternative(counter - 1);
};

hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

hideElment(document.getElementById('n2'));

checkUserType();
getCaseInfo(globalCaseNumber);
