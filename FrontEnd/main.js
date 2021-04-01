Moralis.initialize("Ex6QoD9lxvp4BJ7ZVJCNejuw236DSINOUNMOUpbV"); // Application id from moralis.io
Moralis.serverURL = "https://et2gfmeu3ppx.moralis.io:2053/server"; //Server url from moralis.io
const contractAddress = "0x0a1467B3de4D8d2D965469f43526a6E17364a4E7";

// const fs = require("fs");

// false.readFile;

async function login() {
  try {
    user = await Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }

    console.log(user);
    // alert("User logged in");
    document.getElementById("login_button").style.display = "none";
    document.getElementById("voting").style.display = "block";
    document.getElementById("newCase").style.display = "block";
  } catch (error) {
    console.log(error);
  }
}

async function createUser(_region, _userType) {
//   var load = window.abi;
//   alert(load);
  alert("Region: " + _region + "\nUserType: " + _userType);
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .createUser(_region, _userType)
    .send({ from: ethereum.selectedAddress })
    .on("receipt", function (receipt) {
      console.log(receipt);
      if (
        receipt.events.userCreated.returnValues.confirmation ==
        "User Created successfully"
      ) {
        alert("user created successfully");
      }
    });
}

async function createCase(
  _title,
  _description,
  _startDate,
  _endDate,
  _alternatives
) {
  alert(
    "title: " +
      _title +
      "\ndesciption: " +
      _description +
      "\nstart date: " +
      _startDate +
      "\nend date: " +
      _endDate +
      "\nalternatives: " +
      _alternatives
  );
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .createCase(_title, _description, _startDate, _endDate, _alternatives)
    .send({ from: ethereum.selectedAddress })
    .on("receipt", function (receipt) {
      console.log(receipt);
      if (
        receipt.events.caseCreated.returnValues.confirmation ==
        "Case Created successfully"
      ) {
        alert("Case Created successfully");
      }
    });
}

document.getElementById("login_button").onclick = login;
document.getElementById("create_user").onclick = function () {
  createUser(
    document.getElementById("Region").value,
    document.getElementById("UserType").value
  );
}; // executes function onclick

document.getElementById("create_case").onclick = function () {
  var alternativesa = [
    document.getElementById("alternatives1").value,
    document.getElementById("alternatives2").value,
  ];
  createCase(
    document.getElementById("title").value,
    document.getElementById("description").value,
    (document.getElementById("startDate").innerHTML = new Date(
      $("#startDate").val()
    ).getTime()),
    (document.getElementById("endDate").innerHTML = new Date(
      $("#endDate").val()
    ).getTime()),
    alternativesa
  );
}; // executes function onclick
// document.getElementById("get_user").onclick = getUser(msg.sender);   // returns result to onclick
