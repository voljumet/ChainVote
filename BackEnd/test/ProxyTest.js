const CaseOne = artifacts.require('Case');
const CaseTwo = artifacts.require('CaseTwo');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {
    let instance;
    let instance2;
    let instance3;
    let adminarray = [accounts[1], accounts[3]];

    beforeEach(async function () {
      console.log("AdminArray:  " + adminarray)
      const proxey = await Proxey.new(adminarray);
      const caseOne = await CaseOne.new();
      const caseTwo = await CaseTwo.new();
      //create proxy Case to fool truffle
      
      instance = await CaseOne.at(proxey.address);
      instance2 = await CaseTwo.at(proxey.address);
      instance3 = await Proxey.at(proxey.address);
      await instance3.pause();
      await instance3.upgrade(caseOne.address);
      await instance3.unPause();
    });
 
        
    it("Should be able to use new contract functions", async ()=>{
      await instance3.pause({from: accounts[0]})
      await instance3.upgrade(CaseTwo.address, {from: accounts[0]})
      await instance3.unPause({from: accounts[0]})
      await truffleAssert.passes(
        instance2.verifyNewCase(),
        truffleAssert.ErrorType.REVERT
        )})
          
    it("Should change the address of case contract", async ()=>{
      await instance3.pause({from: accounts[0]})
      await truffleAssert.passes(
        instance3.upgrade(CaseTwo.address, {from: accounts[0]}),
        truffleAssert.ErrorType.REVERT
        )})

    it("Owner should be able to pause contract", async ()=>{
        await truffleAssert.passes(
          instance3.pause({from: accounts[0]}),
          truffleAssert.ErrorType.REVERT
        )})

    it("Owner should be able to unpause contract", async ()=>{
        await instance3.pause({from: accounts[0]})
         await truffleAssert.passes(
          instance3.unPause({from: accounts[0]}),
          truffleAssert.ErrorType.REVERT
         )})

    it("Only owner should be able to unpause contract", async ()=>{
        await truffleAssert.fails(
          instance3.pause({from: accounts[2]}),
          truffleAssert.ErrorType.REVERT
        )})


   it("Should only allow the owner to upgrade", async ()=>{
        await instance3.pause({from: accounts[0]});
           await truffleAssert.fails(
             instance3.upgrade(CaseTwo.address, {from: accounts[2]}),
             truffleAssert.ErrorType.REVERT
           )})

    it("Should not be able to Upgrade when not paused", async () =>{
      await truffleAssert.fails(
        instance3.upgrade(CaseTwo.address, {from: accounts[0]}),
        truffleAssert.ErrorType.REVERT
      )})
    
})