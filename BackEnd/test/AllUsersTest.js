const CaseOne = artifacts.require('Case');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {

    var proxyCaseReDir;

    beforeEach(async function () {
        let proxyCase = await Proxey.deployed();
      proxyCaseReDir = await CaseOne.at(proxyCase.address);
      
      // createCase from SuperAdmin account
        proxyCaseReDir.createCase(
            "second Case", "This is the description",
            Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
            "one", "two", { from: accounts[0] }
        );
    });

    
    it("Should allow users from same region to approve case", async () => {
      // Approve the case
      await truffleAssert.passes(proxyCaseReDir.approve(1, { from: accounts[0] }), truffleAssert.ErrorType.REVERT);
      await truffleAssert.passes(proxyCaseReDir.approve(1, { from: accounts[1] }), truffleAssert.ErrorType.REVERT);
      await truffleAssert.passes(proxyCaseReDir.approve(1, { from: accounts[2] }), truffleAssert.ErrorType.REVERT);
    })

    it("Should allow only users from same region to approve case", async () => {
      // await truffleAssert.passes(proxyCaseReDir.approve(1, { from: accounts[0] }), truffleAssert.ErrorType.REVERT);
      // await truffleAssert.passes(proxyCaseReDir.approve(1, { from: accounts[1] }), truffleAssert.ErrorType.REVERT);
      // await truffleAssert.passes(proxyCaseReDir.approve(1, { from: accounts[2] }), truffleAssert.ErrorType.REVERT);
        // timeout to wait for the case to open
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await timeout(2000);
          
        // test voting with SuperAdmin
        await truffleAssert.passes(proxyCaseReDir.vote(1, 2, { from: accounts[9] }), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(proxyCaseReDir.vote(1, 2, { from: accounts[4] }), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(proxyCaseReDir.vote(1, 2, { from: accounts[2] }), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(proxyCaseReDir.vote(1, 2, { from: accounts[8] }), truffleAssert.ErrorType.REVERT);
          

        //all users should be able to vote on the case created by a SuperAdmin
          
          
          
    })

    
    
})