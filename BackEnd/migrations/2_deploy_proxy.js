// 'Case1' is contract name, NOT FILENAME!

const CaseOne = artifacts.require('Case');
const Proxy = artifacts.require('Proxy');

module.exports = async function (developer, network, accounts) {
  // deploy contracts
  const caseOne = await CaseOne.new();
  const proxy = await Proxy.new(caseOne.address);

  //create proxy Case to fool truffle
  var proxyCaseOne = await CaseOne.at(proxy.address);
  /*
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[0] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[1] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[2] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[3] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[4] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[5] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[6] });
  await proxyCaseOne.createUser('Grimstad', 'Regional', { from: accounts[7] });

  //set the nr of dogs through the proxy
  await proxyCaseOne.createCase('First Case', 20052021, ['Ja', 'Nei']);
  console.log('Case created');

  var limit = await proxyCaseOne.returnLimitApproval(1);
  console.log('Limit: ' + limit); // skal bli 5

  var total = await proxyCaseOne.returnTotalVotes(1);
  console.log('Total: ' + total); // skal bli 14

  await proxyCaseOne.approvalZ(1, { from: accounts[1] });
  var approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log('approvals on case 1: ' + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[2] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log('approvals on case 1: ' + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[3] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log('approvals on case 1: ' + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[4] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log('approvals on case 1: ' + approvalZ);

  await proxyCaseOne.approvalZ(1, { from: accounts[5] });
  approvalZ = await proxyCaseOne.getApprovalZ(1);
  console.log('approvals on case 1: ' + approvalZ);

  console.log('approvals done');

  await proxyCaseOne.vote(1, 1, { from: accounts[1] });
  await proxyCaseOne.vote(1, 1, { from: accounts[2] });
  await proxyCaseOne.vote(1, 1, { from: accounts[3] });
  await proxyCaseOne.vote(1, 1, { from: accounts[4] });
  await proxyCaseOne.vote(1, 1, { from: accounts[5] });
  await proxyCaseOne.vote(1, 1, { from: accounts[6] });

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
};
