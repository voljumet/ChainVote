// 'Case1' is contract name, NOT FILENAME!
const CaseOne = artifacts.require("Case");
const Proxy = artifacts.require("Proxy");

module.exports = async function (developer, network, accounts) {
  // deploy contracts
  const caseOne = await CaseOne.new();
  const proxy = await Proxy.new(caseOne.address);

  //create proxy Case to fool truffle
  var proxyCaseOne = await CaseOne.at(proxy.address);

  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[0] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[1] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[2] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[3] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[4] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[5] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[6] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[7] });
  await proxyCaseOne.createUser("Grimstad", "Regional", { from: accounts[8] });
  await proxyCaseOne.createUser("Grimstad", "Standard", { from: accounts[9] });
  await proxyCaseOne.createUser("Grimstad", "Standard", { from: accounts[10] });
  await proxyCaseOne.createUser("Grimstad", "Standard", { from: accounts[11] });
  await proxyCaseOne.createUser("Grimstad", "Standard", { from: accounts[12] });
  await proxyCaseOne.createUser("Grimstad", "Standard", { from: accounts[13] });

  //set the nr of dogs through the proxy
  await proxyCaseOne.createCase("First Case",16171804 , ["Ja", "Nei"]);
  console.log("Case created");

  await proxyCaseOne.createCase("First Case", 1617086800, ["Ja", "Nei"]);
  console.log("Case created");

  await proxyCaseOne.createCase("First Case", 20052021, ["Ja", "Nei"]);
  console.log("Case created");

  var limit = await proxyCaseOne.returnLimitApproval(1);
  console.log("Limit: " + limit); // skal bli 5

  var total = await proxyCaseOne.returnTotalVotes(1);
  console.log("Total: " + total); // skal bli 14

  await proxyCaseOne.approvalZ(1, { from: accounts[1] });
  var getWait = await proxyCaseOne.getWaitinglistCount();
  var approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log("approvals on case 1: " + approvalZ);
  console.log("Waiting list count" + getWait);

  await proxyCaseOne.approvalZ(1, { from: accounts[2] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log("approvals on case 1: " + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[3] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log("approvals on case 1: " + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[4] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log("approvals on case 1: " + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[5] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  getWait = await proxyCaseOne.getWaitinglistCount();
  console.log("approvals on case 1: " + approvalZ);
  console.log("Waiting list count " + getWait);

  console.log("approvals done");

  await proxyCaseOne.closeForVoting(1, {from: accounts[9]})
  console.log("Closed case one for voting");


  // // await proxyCaseOne.vote(1, 1, { from: accounts[1] });
  // // await proxyCaseOne.vote(1, 1, { from: accounts[2] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[3] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[4] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[5] });
  // await proxyCaseOne.vote(1, 1, { from: accounts[6] });

  var votes = await proxyCaseOne.getCase(1);
  console.log(votes);

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
};;
