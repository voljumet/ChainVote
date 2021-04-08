// 'Case' is contract name, NOT FILENAME!
const CaseOne = artifacts.require("Case");
const Proxey = artifacts.require("Proxy");
const CaseTwo = artifacts.require("CaseTwo");



// import fs module in which writeFile function is defined.
const fsLibrary = require('fs')

module.exports = async function (deployer, network, accounts) {
  let adminarray = [accounts[1], accounts[3]];
  await deployer.deploy(CaseOne);
 

  let proxyinstance = await deployer.deploy(Proxey, adminarray);
  await Proxey.deployed();
  let instanceCase = await CaseOne.deployed();
  await proxyinstance.pause();
  await proxyinstance.upgrade(instanceCase.address);
  await proxyinstance.unPause();
  await deployer.deploy(CaseTwo);
  await CaseTwo.deployed();
  
  
  /*
  let proxyCase = await Proxey.deployed();

  // save address and store in address.js that is loaded in html, for use in main.js
  let data = "const contractAddress = '" + proxyCase.address + "';";
  fsLibrary.writeFile('../FrontEnd/address.js', data, (error) => { 
    if (error) throw err; 
  })

  //create proxy Case to fool truffle
  var proxyCaseReDir = await CaseOne.at(proxyCase.address);
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[0] });
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[1] });
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[2] });
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[3] });
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[4] });
  var start = Math.round(new Date() / 1000) ;
  var end = Math.round(new Date() / 1000) + 60*60;

  await proxyCaseReDir.createCase("First Case", "This is the description", Math.round(new Date() / 1000),  Math.round(new Date() / 1000) + 60*60, "one", "two", { from: accounts[1] });
  console.log("Start: "+start);
  console.log("End: "+end);
  

  await proxyCaseReDir.getApprovalsAndLimit(1)

  await proxyCaseReDir.approve(1, { from: accounts[1] });
  await proxyCaseReDir.approve(1, { from: accounts[2] });
  await proxyCaseReDir.approve(1, { from: accounts[3] });
  await proxyCaseReDir.getApprovalsAndLimit(1)
  await proxyCaseReDir.getMyVote(1);
  setTimeout(async function(){ 
    await proxyCaseReDir.vote(1,1, { from: accounts[3] });
    await proxyCaseReDir.getMyVote(1);
  }, 2000);

  // endDate = 15:00
  // startDate = 13:00
  // TimeStamp = 14:00

  // await proxyCaseOne.approvalZ(1, { from: accounts[3] });
  // approvalZ = await proxyCaseOne.getApprovalZ(1);
  // console.log("approvals on case 1: " + approvalZ);

  // await proxyCaseOne.approvalZ(1, { from: accounts[4] });
  // approvalZ = await proxyCaseOne.getApprovalZ(1);
  // console.log("approvals on case 1: " + approvalZ);

  // await proxyCaseOne.approvalZ(1, { from: accounts[5] });
  // approvalZ = await proxyCaseOne.getApprovalZ(1);
  // getWait = await proxyCaseOne.getWaitinglistCount();
  // console.log("approvals on case 1: " + approvalZ);
  // console.log("Waiting list count " + getWait);

  // console.log("approvals done");
/*


  // await proxyCaseOne.closeForVoting(1, {from: accounts[9]})
  // console.log("Closed case one for voting");


  // // await proxyCaseOne.vote(1, 1, { from: accounts[1] });
  // // await proxyCaseOne.vote(1, 1, { from: accounts[2] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[3] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[4] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[5] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[6] });

  // var votes = await proxyCaseOne.getCase(1);
  // console.log(votes);

  /*
  var myVote = await proxyCaseOne.getMyVote(1);
  console.log("My Vote: " + myVote);
  console.log("Voting...");
  await proxyCaseOne.vote(1, 1);
  myVote = await proxyCaseOne.getMyVote(1);
  console.log("My Vote: " + myVote);

  // bytter contract
  proxyCaseOne = await Case2.at(proxy.address);
  proxyCaseOne.initialize(accounts[0]);

  myVote = await proxyCaseOne.getMyVote(1);
  console.log("My Vote, after update: " + myVote);

  await proxyCaseOne.vote(1, 2);
  myVote = await proxyCaseOne.getMyVote(1);
  console.log("My Vote, after change: " + myVote);
  */
};
