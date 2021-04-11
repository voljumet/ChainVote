// import contractAddress as ok from "../address.js";
// 'Case' is contract name, NOT FILENAME!
const CaseOne = artifacts.require("Case");
const Proxey = artifacts.require("Proxy");
const CaseTwo = artifacts.require("CaseTwo");

// import fs module in which writeFile function is defined.
const fsLibrary = require("fs");

module.exports = async function (deployer, network, accounts) {
  let adminarray = [
    accounts[5],
    accounts[6],
    accounts[7]
  ];
  await deployer.deploy(CaseOne);

  let proxyinstance = await deployer.deploy(Proxey, adminarray, {from: accounts[0]});

  let instanceCase = await CaseOne.deployed();
  await proxyinstance.upgrade(instanceCase.address);
  await proxyinstance.unPause();
  // await deployer.deploy(CaseTwo);
  // await CaseTwo.deployed();

  let proxyCase = await Proxey.deployed();

  // save address and store in address.js that is loaded in html, for use in main.js
  fsLibrary.writeFile("../FrontEnd/address.js", "const contractAddress = '" + proxyCase.address + "';", (error) => {
    if (error) throw err;
  });

  //create proxy Case to fool truffle
  var proxyCaseReDir = await CaseOne.at(proxyCase.address);
  
  await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[0]});
  await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[1]});
  await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[2]});
  await proxyCaseReDir.createUser("Grimstad", "Admin", {from: accounts[3]});
  await proxyCaseReDir.createUser("Grimstad", "Admin", { from: accounts[4] });
  await proxyCaseReDir.createUser("Oslo", "SuperAdmin", { from: accounts[5] });
  await proxyCaseReDir.createUser("Oslo", "SuperAdmin", { from: accounts[6] });
  await proxyCaseReDir.createUser("Oslo", "SuperAdmin", { from: accounts[7] });
  await proxyCaseReDir.createUser("Oslo", "Standard", {from: accounts[8]});
  await proxyCaseReDir.createUser("Grimstad", "Standard", {from: accounts[9]});

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
