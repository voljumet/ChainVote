// 'Dogs' is contract name, NOT FILENAME!
const Dogs = artifacts.require("Dogs");
const DogsUpdated = artifacts.require("DogsUpdated");
const Proxy = artifacts.require("Proxy");

module.exports = async function (developer, network, accounts) {
  // deploy contracts
  const dogs = await Dogs.new();
  const proxy = await Proxy.new(dogs.address);

  //create proxy Dog to fool truffle
  var proxyDog = await Dogs.at(proxy.address);

  //set the nr of dogs through the proxy
  await proxyDog.setNumberOfDogs(10);

  //tested
  var nrOfDogs = await proxyDog.getNumberOfDogs();
  console.log("before update: " + nrOfDogs.toNumber());

  //deploy new version of Dogs
  const dogsUpdated = await DogsUpdated.new();
  proxy.upgrade(dogsUpdated.address);

  //fool truffle once again. It now thinks proxyDog has all functions.
  proxyDog = await DogsUpdated.at(proxy.address);
  // initialize proxy state.
  proxyDog.initialize(accounts[0]);

  //check that storage remained
  nrOfDogs = await proxyDog.getNumberOfDogs();
  console.log("after update: " + nrOfDogs.toNumber());

  //set the nr of dogs through the proxy with NEW FUNC CONTRACT
  await proxyDog.setNumberOfDogs(30);

  //check that setNumberOfDogs worked with new func
  nrOfDogs = await proxyDog.getNumberOfDogs();
  console.log("after change: " + nrOfDogs.toNumber());
};
 