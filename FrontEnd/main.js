Moralis.initialize("Ex6QoD9lxvp4BJ7ZVJCNejuw236DSINOUNMOUpbV"); // Application id from moralis.io
Moralis.serverURL = "https://et2gfmeu3ppx.moralis.io:2053/server"; //Server url from moralis.io
const contractAddress = "0x8f8e48200B5b3940c0172214E72FAd1e2abacfc5";

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
    document.getElementById("getCase").style.display = "block";
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

async function createCase(_title, _description, _startDate, _endDate, alt1, alt2, alt3, alt4, alt5) {
  var array = [alt1,alt2,alt3,alt4,alt5];
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
      array
  );
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .createCase(_title, _description, _startDate, _endDate, alt1, alt2, alt3, alt4, alt5)
    .send({ from: ethereum.selectedAddress, value: 100 })
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

async function getCase(_caseNumber) {
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .getCase(_caseNumber)
    .send({ from: ethereum.selectedAddress })
    .on("receipt", function (receipt) {
      console.log(receipt);
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
  createCase(
    document.getElementById("title").value,
    document.getElementById("description").value,
    (document.getElementById("startDate").innerHTML = new Date(
      $("#startDate").val()
    ).getTime()),
    (document.getElementById("endDate").innerHTML = new Date(
      $("#endDate").val()
    ).getTime()),
    document.getElementById("alternative1").value,
    document.getElementById("alternative2").value,
    document.getElementById("alternative3").value,
    document.getElementById("alternative4").value,
    document.getElementById("alternative5").value
  );
};

document.getElementById("get_case").onclick = function () {
  getCase(document.getElementById("caseNumber").value);
};

// executes function onclick
// document.getElementById("get_user").onclick = getUser(msg.sender);   // returns result to onclick
