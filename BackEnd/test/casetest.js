
const CaseOne = artifacts.require('Case');
const Proxy = artifacts.require('Proxy');
const AssertionError = require('assertion-error');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {
    let instance;
 
    
    beforeEach(async function () {
      const caseOne = await CaseOne.new();
      const proxy = await Proxy.new(caseOne.address);
      //create proxy Case to fool truffle
      instance = await CaseOne.at(proxy.address);
    });

    /*
    //////////////////Create User//////////////////////////
    it('Should create a user of any type', async function () {
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Regional', { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT);
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'National', { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT);
       await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[2] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('Should not create a new user with same account', async function () {
       await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await truffleAssert.fails(
        instance.createUser('Grimstad', 'Regional', { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

      ////////////////////////////////////////////////////////

      ////////////// Get User Array Length ///////////////////
      it('Should get user array length', async function () {
        await  instance.createUser('Grimstad', 'Regional', { from: accounts[1] })
        let result = await instance.getUserArrayLength('Grimstad', 'Regional');
        assert(result.toNumber() === 1, "Length not set corecctly");
      });

      ////////////////////////////////////////////////////////


      ///////////////// Create Case //////////////////////////

       it('User type Reginal can create cases', async function () {
         // First create a user of type Reginal / National 
         // Then test createUser
         await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
         await truffleAssert.passes(
           instance.createCase('First Case', 20052021, ['Ja', 'Nei'], { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });


       it('User type National can create a cases', async function () {
     
         await instance.createUser('Grimstad', 'National', { from: accounts[1] });
         await truffleAssert.passes(
           instance.createCase('First Case', 20052021, ['Ja', 'Nei'], { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });

       it('User type Standard can not create a case', async function () {
       
         await instance.createUser('Grimstad', 'Standard', { from: accounts[1] });
         await truffleAssert.fails(
           instance.createCase('First Case', 20052021, ['Ja', 'Nei'], { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });

        it('Odd number of Regional/National users can not create a case (2)', async function () {
  
         await instance.createUser('Grimstad', 'Regional', {from: accounts[1] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[2] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[3] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[4] });
         await truffleAssert.fails(
           instance.createCase('First Case', 20052021, ['Ja', 'Nei'], { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });

       it('Odd number of Regional/National users can not create a case', async function () {
    
         await instance.createUser('Grimstad', 'Regional', {from: accounts[1] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[2] });
         await truffleAssert.fails(
           instance.createCase('First Case', 20052021, ['Ja', 'Nei'], { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });
     

       it('Should get a existing case', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
          from: accounts[1],
         });
        let result = await instance.getCase(1);
        assert(result._title == 'First Case');
    });
     
       it('Should not get a non-existent case', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await truffleAssert.fails(instance.getCase(1),truffleAssert.ErrorType.REVERT
           );
       });
      
        it('Should not get case when it is deactivated', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
          from: accounts[1],
        });
        await instance.deleteCase(1);
        await truffleAssert.fails(instance.getCase(1),truffleAssert.ErrorType.REVERT
           );
       });
         

        it('Should delete a case', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
          from: accounts[1],
        });
        await truffleAssert.passes(instance.deleteCase(1),truffleAssert.ErrorType.REVERT
           );
       });

     
      it('Should not delete a case that is open for voting', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
          from: accounts[1],
        });
        await instance.approvalZ(1, { from: accounts[1] });
        await truffleAssert.fails(instance.deleteCase(1),truffleAssert.ErrorType.REVERT
           );
       });
        

    /////////////////////////////////////////////////////////
    //////////////////////////// ApprovalZ /////////////////////////

    it('Regional user can approve a case', async function () {
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
        from: accounts[1],
      });

      await truffleAssert.passes(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('National user can approve a case', async function () {
      await instance.createUser('Grimstad', 'National', { from: accounts[1] });
      await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
        from: accounts[1],
      });

      await truffleAssert.passes(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('Standard user can not approve a case', async function () {
      await instance.createUser('Grimstad', 'Standard', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
        from: accounts[2],
      });

      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('National/Regional should not approve twice', async function () {
      await instance.createUser('Grimstad', 'National', { from: accounts[1] });
      await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
        from: accounts[1],
      });
      await instance.approvalZ(1, { from: accounts[1] });
      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('National/Regional user should not approve an approved case', async function () {
      await instance.createUser('Grimstad', 'National', { from: accounts[1] });
      await instance.createUser('Grimstad', 'National', { from: accounts[2] });
      await instance.createUser('Grimstad', 'National', { from: accounts[3] });
      await instance.createUser('Grimstad', 'National', { from: accounts[4] });
      await instance.createUser('Grimstad', 'National', { from: accounts[5] });

      await instance.createCase('First Case', 20052021, ['Ja', 'Nei'], {
        from: accounts[1],
      });

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });

      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[4] }),
        truffleAssert.ErrorType.REVERT
      );
    });
    /////////////////////////////////////////////////////////
     */

    
  });