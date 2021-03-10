// 'Case1' is contract name, NOT FILENAME!
const Case1 = artifacts.require("Case");
const Case2 = artifacts.require("NewCase");
const Proxy = artifacts.require("Proxy");

module.exports = async function (developer, network, accounts) {
  // deploy contracts
  const case1 = await Case1.new();
  const proxy = await Proxy.new(case1.address);

  //create proxy Dog to fool truffle
  var proxyCase1 = await Case1.at(proxy.address);

  //set the nr of dogs through the proxy
  await proxyCase1.createCase("First Case", 20052020, 100);
  await proxyCase1.addAlternatives(1, "Ja");
  await proxyCase1.addAlternatives(1, "Nei");
  await proxyCase1.openVoting(1);

  var myVote = await proxyCase1.getMyVote(1);
  console.log("My Vote: " + myVote);
  console.log("Voting...");
  await proxyCase1.vote(1, 1);
  myVote = await proxyCase1.getMyVote(1);
  console.log("My Vote: " + myVote);

  proxyCase1 = await Case2.at(proxy.address);
  proxyCase1.initialize(accounts[0]);

  myVote = await proxyCase1.getMyVote(1);
  console.log("My Vote, after update: " + myVote);

  await proxyCase1.vote(1, 2);
  myVote = await proxyCase1.getMyVote(1);
  console.log("My Vote, after change: " + myVote);
};
