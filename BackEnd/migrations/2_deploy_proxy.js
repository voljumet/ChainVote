// 'Case' is contract name, NOT FILENAME!

const CaseOne = artifacts.require("Case");
const Proxey = artifacts.require("Proxy");
const CaseTwo = artifacts.require("CaseTwo");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(CaseOne);
  let instanceCase = await CaseOne.deployed();

  await deployer.deploy(Proxey, instanceCase.address);
  await Proxey.deployed();

  await deployer.deploy(CaseTwo);
  await CaseTwo.deployed();
  
  
  /*
  let proxyCase = await Proxey.deployed();
  
  //create proxy Case to fool truffle
  var proxyCaseReDir = await CaseOne.at(proxyCase.address);
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[0] });
  var user = await proxyCaseReDir.getUser({from: accounts[0] })
  console.log("User1: " + user);
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[1] });
  console.log("User2: " + await proxyCaseReDir.getUser({from: accounts[1] }));
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[2] });
  console.log("User3: " + await proxyCaseReDir.getUser({from: accounts[2] }));
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[3] });
  console.log("User4: " + await proxyCaseReDir.getUser({from: accounts[3] }));
  await proxyCaseReDir.createUser('Grimstad', 'Regional', { from: accounts[4] });
  console.log("User5: " + await proxyCaseReDir.getUser({from: accounts[4] }));
  
  await proxyCaseReDir.createCase("First Case", "This is the description",16171804,1234564,"en","to","tre","fire","fem", { from: accounts[1] });
  console.log("Case created");
  console.log( await proxyCaseReDir.getCase(1, {from: accounts[1]}))
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[2] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[3] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[4] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[5] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[6] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[7] });

  //set the nr of dogs through the proxy

  // await proxyCaseOne.createCase("First Case", 1617086800, ["Ja", "Nei"]);
  // console.log("Case created");

  // await proxyCaseOne.createCase("First Case", 20052021, ["Ja", "Nei"]);
  // console.log("Case created");

  // var limit = await proxyCaseOne.returnLimitApproval(1);
  // console.log("Limit: " + limit); // skal bli 5

  // var total = await proxyCaseOne.returnTotalVotes(1);
  // console.log("Total: " + total); // skal bli 14

  // await proxyCaseOne.approvalZ(1, { from: accounts[1] });
  // var getWait = await proxyCaseOne.getWaitinglistCount();
  // var approvalZ = await proxyCaseOne.getApprovalZ(1);
  // console.log("approvals on case 1: " + approvalZ);
  // console.log("Waiting list count" + getWait);

  // await proxyCaseOne.approvalZ(1, { from: accounts[2] });
  // approvalZ = await proxyCaseOne.getApprovalZ(1);
  // console.log("approvals on case 1: " + approvalZ);

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
