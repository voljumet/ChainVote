Moralis.initialize('Ex6QoD9lxvp4BJ7ZVJCNejuw236DSINOUNMOUpbV'); // Application id from moralis.io
Moralis.serverURL = 'https://et2gfmeu3ppx.moralis.io:2053/server'; //Server url from moralis.io

async function login() {
  try {
    user = await Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }

    console.log(user);
    // alert("User logged in");
    document.getElementById('login_button').style.display = 'none';
    document.getElementById('createUser').style.display = 'block';
    document.getElementById('createCase').style.display = 'block';
    document.getElementById('getMyVote').style.display = 'block';
    document.getElementById('approve').style.display = 'block';
    document.getElementById('getApprovalsAndLimit').style.display = 'block';
    document.getElementById('vote').style.display = 'block';
    document.getElementById('endVoting').style.display = 'block';
    document.getElementById('addAlternatives').style.display = 'block';
    // document.getElementById("getCase").style.display = "block";
    // document.getElementById("getUserArr").style.display = "block";
    // document.getElementById("getUser").style.display = "block";
    // document.getElementById("getTotalVotes").style.display = "block";
    // document.getElementById("getCasesWaitingForApproval").style.display = "block";
  } catch (error) {
    console.log(error);
  }
}

async function createUser(_region, _userType) {
  //   var load = window.abi;
  //   alert(load);
  alert('Region: ' + _region + '\nUserType: ' + _userType);
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .createUser(_region, _userType)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.userCreated.returnValues.confirmation) {
        alert('user created successfully');
      }
    });
}

// async function getUserArrayLength(_region, _userType) {
//   alert("Region: " + _region + "\nUserType: " + _userType);
//   window.web3 = await Moralis.Web3.enable();
//   let abi = await getAbi();
let contractInstance = new web3.eth.Contract(abi, contractAddress);
//   contractInstance.methods
//     .getUserArrayLength(_region, _userType)
//     .send({ from: ethereum.selectedAddress })
//     .on("receipt", function (receipt) {
//       console.log(receipt);
//       alert(
//         "Users with same type and region: " +
//           receipt.events.getUsersE.returnValues.usersWithSameRegionAndUserType
//       );
//     });
// }

// createCase
async function createCase(
  _title,
  _description,
  _startDate,
  _endDate,
  alt1,
  alt2
) {
  var array = [alt1, alt2];
  alert(
    'title: ' +
      _title +
      '\ndesciption: ' +
      _description +
      '\nstart date: ' +
      _startDate +
      '\nend date: ' +
      _endDate +
      '\nalternatives: ' +
      array
  );
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .createCase(
      _title,
      _description,
      _startDate / 1000,
      _endDate / 1000,
      alt1,
      alt2
    )
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.confirmationE.returnValues.confirmationE) {
        alert('case Created successfully');
      }
    });
}

// get case number
// async function getCase(_caseNumber) {
//   window.web3 = await Moralis.Web3.enable();
//   let abi = await getAbi();
let contractInstance = new web3.eth.Contract(abi, contractAddress);
//   contractInstance.methods
//     .getCase(_caseNumber)
//     .send({ from: ethereum.selectedAddress })
//     .on("receipt", function (receipt) {
//       console.log(receipt);
//     });
// }

// Get user region and userType
// async function getUser() {
//   window.web3 = await Moralis.Web3.enable();
//   let abi = await getAbi();
let contractInstance = new web3.eth.Contract(abi, contractAddress);
//   contractInstance.methods
//     .getUser()
//     .send({ from: ethereum.selectedAddress })
//     .on("receipt", function (receipt) {
//       console.log(receipt);
//       alert(
//         "Region: " +
//           receipt.events.getUserE.returnValues.region +
//           "\nUsertype: " +
//           receipt.events.getUserE.returnValues.userType
//       );
//     });
// }

// async function getCasesWaitingForApproval() {
//   window.web3 = await Moralis.Web3.enable();
//   let abi = await getAbi();
let contractInstance = new web3.eth.Contract(abi, contractAddress);
//   contractInstance.methods
//     .getCasesWaitingForApproval()
//     .send({ from: ethereum.selectedAddress })
//     .on("receipt", function (receipt) {
//       console.log(receipt);
//       alert(
//         "Region: " +
//           receipt.events.casesWaitingForApprovalE.returnValues
//             .casesWaitingForApproval
//       );
//     });
// }

async function endVoting(caseNumber) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .endVoting(caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (
        receipt.events.confirmationE.returnValues.confirmation ==
        'Voting closed successfully'
      ) {
        alert(receipt.events.confirmationE.returnValues.confirmation);
      }
    });
}

async function approve(caseNumber) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .approve(caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.confirmationE.returnValues.confirmation) {
        alert(
          'case Number ' +
            receipt.events.caseApprovedE.returnValues.caseNumber +
            ', ' +
            receipt.events.caseApprovedE.returnValues.title +
            ' is now approved'
        );
      }
    });
}

// async function getMyVote(caseNumber) {
//   window.web3 = await Moralis.Web3.enable();
//   let abi = await getAbi();
let contractInstance = new web3.eth.Contract(abi, contractAddress);
//   contractInstance.methods
//     .getMyVote(caseNumber)
//     .send({ from: ethereum.selectedAddress })
//     .on("receipt", function (receipt) {
//       console.log(receipt);
//       if (
//         receipt.events.confirmationE.returnValues.confirmation ==
//         "Your approval has been recieved"
//       ) {
//         alert(receipt.events.confirmationE.returnValues.confirmation);
//       }
//     });
// }

async function deactivateCase(caseNumber) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .deactivateCase(caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.confirmationE.returnValues.confirmation) {
        alert(receipt.events.confirmationE.returnValues.confirmation);
      }
    });
}

// async function getTotalVotes(caseNumber) {
//   window.web3 = await Moralis.Web3.enable();
//   let abi = await getAbi();
let contractInstance = new web3.eth.Contract(abi, contractAddress);
//   contractInstance.methods
//     .getTotalVotes(caseNumber)
//     .send({ from: ethereum.selectedAddress })
//     .on("receipt", function (receipt) {
//       console.log(receipt);
//       alert(
//         "Total votes on case " +
//           caseNumber +
//           ": " +
//           receipt.events.totalVotesE.returnValues.toalVotes
//       );
//     });
// }

async function getMyVote(caseNumber) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .getMyVote(caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      alert(
        'voted alternative: ' +
          receipt.events.myVoteE.returnValues.votedAlternative
      );
    });
}

async function getApprovalsAndLimit(caseNumber) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .getApprovalsAndLimit(caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      alert(
        'Number of approvals: ' +
          receipt.events.approvalsE.returnValues.numberOfApprovals +
          'Number of limit: ' +
          receipt.events.approvalsE.returnValues.limit
      );
    });
}

async function vote(caseNumber, alternative) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .vote(caseNumber, alternative)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      if (receipt.events.confirmationE.returnValues.confirmation) {
        alert(receipt.events.confirmationE.returnValues.confirmation);
      }
    });
}

async function addAlternatives(caseNumber, alternative) {
  window.web3 = await Moralis.Web3.enable();
  let abi = await getAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .addAlternatives(caseNumber, alternative)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', function (receipt) {
      console.log(receipt);
      alter(receipt.events.addApprovalsE.returnValues.stringAlt);
      alert(receipt.events.addApprovalsE.returnValues.uintAlt);
    });
}

document.getElementById('login_button').onclick = login;
// document.getElementById("get_users").onclick = getUserArrayLength;
// document.getElementById("get_user").onclick = getUser;

// document.getElementById("get_case").onclick = function () {
//   getCase(document.getElementById("caseNumber1").value);
// };

document.getElementById('end_voting').onclick = function () {
  endVoting(document.getElementById('caseNumber3').value);
};

document.getElementById('vote_').onclick = function () {
  vote(
    document.getElementById('caseNumber4').value,
    document.getElementById('alternative').value
  );
};

document.getElementById('get_my_vote').onclick = function () {
  getMyVote(document.getElementById('caseNumber5').value);
};

// document.getElementById("get_total_votes").onclick = function () {
//   getTotalVotes(document.getElementById("caseNumber6").value);
// };

document.getElementById('get_Approvals_And_Limit').onclick = function () {
  getApprovalsAndLimit(document.getElementById('caseNumber7').value);
};

// document.getElementById(
//   "get_Cases_Waiting_For_Approval"
// ).onclick = function () {
//   getCasesWaitingForApproval();
// };

document.getElementById('approve_').onclick = function () {
  approve(document.getElementById('caseNumber9').value);
};

document.getElementById('add_Alternatives').onclick = function () {
  addAlternatives(
    document.getElementById('caseNumber1').value,
    document.getElementById('alternatives3').value
  );
};

document.getElementById('create_user').onclick = function () {
  createUser(
    document.getElementById('Region1').value,
    document.getElementById('UserType1').value
  );
};

// document.getElementById("get_user_array_length").onclick = function () {
//   getUserArrayLength(
//     document.getElementById("region2").value,
//     document.getElementById("UserType2").value
//   );
// };

document.getElementById('create_case').onclick = function () {
  createCase(
    document.getElementById('title').value,
    document.getElementById('description').value,

    (document.getElementById('startDate').innerHTML = new Date(
      $('#startDate').val()
    ).getTime()),
    (document.getElementById('endDate').innerHTML = new Date(
      $('#endDate').val()
    ).getTime()),
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
