const CaseOne = artifacts.require('Case');
const CaseTwo = artifacts.require('Case');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {
    let instance;
    let instance2;
    let instance3;

    beforeEach(async function () {
      const caseOne = await CaseOne.new();
      const proxey = await Proxey.new(caseOne.address);
      const caseTwo = await CaseTwo.new();
      //create proxy Case to fool truffle
      instance = await CaseOne.at(proxey.address);
      instance2 = await CaseTwo.at(caseTwo.address);
      instance3 = await Proxey.at(proxey.address);
    });

    it("Should change the address of case contract", async ()=>{
      await instance3.pause({from: accounts[0]})
      await truffleAssert.passes(
        instance3.upgrade(CaseTwo.address, {from: accounts[0]}),
        truffleAssert.ErrorType.REVERT
      )})

    it("Should be able to pause contract", async ()=>{
        await truffleAssert.passes(
          instance3.pause({from: accounts[0]}),
          truffleAssert.ErrorType.REVERT
        )})

    it("Should be able to unpause contract", async ()=>{
        await instance3.pause({from: accounts[0]})
         await truffleAssert.passes(
          instance3.unPause({from: accounts[0]}),
          truffleAssert.ErrorType.REVERT
         )})

    // it("Should only allow the owner to upgrade", async ()=>{
    //       await truffleAssert.passes(
    //         instance3.pause({from: accounts[2]}),
    //         instance3.upgrade(CaseTwo.address, {from: accounts[2]}),
    //         truffleAssert.ErrorType.REVERT
    //       )})
})