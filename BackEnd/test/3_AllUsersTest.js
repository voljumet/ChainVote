const CaseOne = artifacts.require('Case');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {

    var instance;

    function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    beforeEach(async function () {
        let proxyCase = await Proxey.deployed();
      instance = await CaseOne.at(proxyCase.address);
      
      
    });

    it('Should create a user of any type', async function () {
      await truffleAssert.passes(
       instance.createUser('Grimstad', 'Admin', { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Admin', { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Admin', { from: accounts[2] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[3] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[4] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[5] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[6] }),
        truffleAssert.ErrorType.REVERT
      );
    });
    
    it("Create Case as Admin", async () => {
      // createCase from SuperAdmin account
      instance.createCase(
            "second Case", "This is the description",
            Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
            "one", "two", { from: accounts[0] }
        );
    })

    
    it("Should allow users from same region to approve case", async () => {
      // Approve the case
      await truffleAssert.passes(instance.approve(1, { from: accounts[0] }), truffleAssert.ErrorType.REVERT);
      await truffleAssert.passes(instance.approve(1, { from: accounts[1] }), truffleAssert.ErrorType.REVERT);
      await truffleAssert.fails(instance.approve(1, { from: accounts[2] }), truffleAssert.ErrorType.REVERT);
    })

    it("Should allow only users from same region to approve case", async () => {
        // timeout to wait for the case to open
        
        await timeout(2000);
          
        // test voting with SuperAdmin
        await truffleAssert.passes(instance.vote(1, 2, { from: accounts[1] }), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(instance.vote(1, 2, { from: accounts[4] }), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(instance.vote(1, 2, { from: accounts[2] }), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(instance.vote(1, 2, { from: accounts[8] }), truffleAssert.ErrorType.REVERT);
          

        //all users should be able to vote on the case created by a SuperAdmin
          
          
          
    })

    
    
})