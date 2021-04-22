// import contractAddress as ok from "../address.js";
// 'Case' is contract name, NOT FILENAME!
const CaseOne = artifacts.require("Case");
// const CaseTwo = artifacts.require("CaseTwo");
const Proxey = artifacts.require("Proxy");

// import fs module in which writeFile function is defined.
const fsLibrary = require("fs");

module.exports = async function (deployer, network, accounts) {
  let adminarray = [
    accounts[7],
    accounts[8],
    accounts[9]
  ];
  await deployer.deploy(CaseOne, {from: accounts[9]});
  // await deployer.deploy(CaseTwo, {from: accounts[9]});
  

  let proxyinstance = await deployer.deploy(Proxey, adminarray,"Grimstad", {from: accounts[0]});

  let instanceCase = await CaseOne.deployed();
  await proxyinstance.upgrade(instanceCase.address, {from: accounts[9]});
  await proxyinstance.unPause({from: accounts[9]});

  let proxyCase = await Proxey.deployed();

  // save address and store in address.js that is loaded in html, for use in main.js
  fsLibrary.writeFile("../FrontEnd/address.js", "const contractAddress = '" + proxyCase.address + "';", (error) => {
    if (error) throw err;
  });

  //create proxy Case to fool truffle
  // var proxyCaseReDir = await CaseOne.at(proxyCase.address);
  
  // await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[0]});
  // await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[1]});
  // await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[2]});
  // await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[3]});
  // await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[4]});
  // await proxyCaseReDir.createUser("Oslo", "SuperAdmin", {from: accounts[5]});
  // await proxyCaseReDir.createUser("Oslo", "SuperAdmin", {from: accounts[6]});
  // await proxyCaseReDir.createUser("Oslo", "SuperAdmin", {from: accounts[7]});
  // await proxyCaseReDir.createUser("Oslo", "Standard", {from: accounts[8]});
  // await proxyCaseReDir.createUser("Grimstad", "Standard", {from: accounts[9]});

  // let result = await proxyCaseReDir.createCase(
  //   "First Case",
  //   "This is the description",
  //   Math.round(new Date() / 1000) + 2,
  //   Math.round(new Date() / 1000) + 60 * 60,
  //   "one",
  //   "two",
  //   { from: accounts[1] }
  // );
  
  // console.log(result.logs[0]);
  
  // result = await proxyCaseReDir.getApprovalsAndLimit(1);
  // console.log(result.logs[0]);

  
  

  
};



// const CaseOne = artifacts.require("Case");
// const Proxey = artifacts.require("Proxy");


// module.exports = async function (deployer, network, accounts) {

//     let caseContract = await CaseOne.deployed();
//     let proxyContract = await Proxey.deployed();
//     var redirectToCase = await CaseOne.at(proxyContract.address);

//     await redirectToCase.approve(1, { from: accounts[1] });
//     await redirectToCase.approve(1, { from: accounts[2] });
//     await redirectToCase.approve(1, { from: accounts[3] });

//     result = await redirectToCase.getMyVote(1);
//     console.log(result.logs[0]);
    
//     console.log("Timeout 2sec-------------------------------------")
//     setTimeout(async function () {
//         await redirectToCase.vote(1, 1, { from: accounts[4] });

//     }, 2000);

    
//     result = await redirectToCase.getMyVote(1, { from: accounts[4] });
//     console.log("after vote: "+result.logs[0]);



  
// };