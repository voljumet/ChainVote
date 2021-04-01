Moralis.initialize("Ex6QoD9lxvp4BJ7ZVJCNejuw236DSINOUNMOUpbV"); // Application id from moralis.io
Moralis.serverURL = "https://et2gfmeu3ppx.moralis.io:2053/server"; //Server url from moralis.io
const contractAddress = "0xa362b2c1766e362E8fF73c04eb2646720960E8eF";

async function login() {
  try {
    user = await Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }

    console.log(user);
    alert("User logged in");
    document.getElementById("login_button").style.display = "none";
    document.getElementById("voting").style.display = "block";
  } catch (error) {
    console.log(error);
  }
}

async function createUser(_region, _userType) {
  alert("Region: " + _region + "\nUserType: " + _userType);
  window.web3 = await Moralis.Web3.enable();
  let contractInstance = new web3.eth.Contract(window.abi, contractAddress);
  contractInstance.methods
    .createUser(_region, _userType)
    .send({ from: ethereum.selectedAddress })
    .on("receipt", function (receipt) {
        console.log(receipt);
        if (receipt.events.userCreated.returnValues.confirmation == "User Created successfully") {
            alert("user created successfully")
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
// document.getElementById("get_user").onclick = getUser(msg.sender);   // returns result to onclick
