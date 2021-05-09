
const CaseOne = artifacts.require('Case');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {
    let instance;

    //
    //  The deployment contract creates 3x SuperAdmin, two as input and one as msg.sender !!!
    //

     beforeEach(async function () {
    // it('Should get the deployed case, and point caseOne to proxys address', async function () {
      let proxyCase = await Proxey.deployed();
      instance = await CaseOne.at(proxyCase.address);

    }); 
    
    //////////////////Create User//////////////////////////
    it('Should create admin users', async function () {
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
    });
    it("Should create standard users", async()=>{
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
    })

    it('Should not be able to change userType or Region on account to the same', async function () {
      await truffleAssert.fails(
        instance.createUser('Grimstad', 'Admin', { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    //These tests work, but due to the changed user restriction timer, fails tests 
    //longer down in the test file. 

    //  it('Should be able to change userType on account', async function () {
    //    await truffleAssert.passes(
    //      instance.createUser('Grimstad', 'Standard', { from: accounts[2] }),
    //      truffleAssert.ErrorType.REVERT
    //    );
    //  })
    //  it('Should able to change Region on account', async function () {
    //    await truffleAssert.passes(
    //      instance.createUser('Oslo', 'Standard', { from: accounts[2] }),
    //      truffleAssert.ErrorType.REVERT
    //    );
    //  });

    //  it('Should able to change userType on account', async function () {
    //   await truffleAssert.passes(
    //     instance.createUser('Oslo', 'Admin', { from: accounts[4] }),
    //     truffleAssert.ErrorType.REVERT
    //   );
    // });

    ///////////////////////////CREATE CASE/////////////////////////////////////////////
      
    it('Should allow admins to create case', async function () {
        await truffleAssert.passes(
          instance.createCase('First Case', 'Descripton',
          Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
          'yes', 'no', { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
          );
    });
        
        
    it('Should allow superAdmins to create case', async function () {
          await truffleAssert.passes(
            instance. createCase('Second Case', 'Descripton',
            Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
            'yes', 'no', { from: accounts[9] }),
            truffleAssert.ErrorType.REVERT
            );
    });
          
    it('Should NOT allow standard users to create case', async function () {
            await truffleAssert.fails(
              instance. createCase('Third Case', 'Descripton',
              Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
              'yes', 'no', { from: accounts[3] }),
              truffleAssert.ErrorType.REVERT
              );
    });

            
    it('Even number of Admin can NOT create a case', async function () {
      instance.createUser('Grimstad', 'Admin', { from: accounts[5] })
      await truffleAssert.fails(
        instance. createCase('Third Case', 'Descripton',
        Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
        'yes', 'no', { from: accounts[5] }),
        truffleAssert.ErrorType.REVERT
        );
    });

    it('Even number of SuperAdmin can NOT create a case', async function () {
         await instance.createUser('Grimstad', 'SuperAdmin', {from: accounts[5] });
         await truffleAssert.fails(
           instance.createCase('Third Case', 'Descripton',
             Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
             'yes', 'no', { from: accounts[9] }),
           truffleAssert.ErrorType.REVERT
         );
      await instance.createUser('Grimstad', 'Standard', { from: accounts[5] }); // reverts back to a standard
      
    });


    it('Should deactivate case', async function () {
      await instance.createCase('third Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
          'yes', 'no', { from: accounts[9], });
      
      let end = await instance.endVoting(3);

      truffleAssert.eventEmitted(end, 'myVoteE', (ev) => {
        return ev.votedAlternative === 'Case Deactivated';
      });

      truffleAssert.eventEmitted(end, 'confirmationE', (ev) => {
        return ev.confirmation === true;
      });
        
    });
   
    it('Should NOT be able to deactivate case that has gotten approvals', async function () {
      await instance.createCase('fourth Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[9],});
      await instance.approve(4, { from: accounts[9] });
      await truffleAssert.fails(
        instance.endVoting(4),
        truffleAssert.ErrorType.REVERT
      );
    });
        
    ///////////////////////////APPROVE/////////////////////////////////////////////

    it('Admin can approve a case', async function () {
      await truffleAssert.passes(
        instance.approve(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('SuperAdmin user can approve a case', async function () {
      await truffleAssert.passes(
        instance.approve(2, { from: accounts[8] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('Standard user can not approve a case', async function () {
      await truffleAssert.fails(
        instance.approve(1, { from: accounts[5] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('Admin cannot approve case twice', async function () {
      await truffleAssert.fails(
        instance.approve(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('SuperAdmin cannot approve case twice', async function () {
      await truffleAssert.fails(
        instance.approve(2, { from: accounts[8] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('Admin cannot approve an approved case', async function () {
      await instance.approve(1, { from: accounts[0] });
      await truffleAssert.fails(
        instance.approve(1, { from: accounts[4] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('SuperAdmin cannot approve an approved case', async function () {
      await instance.approve(2, { from: accounts[7] });

      await truffleAssert.fails(
        instance.approve(1, { from: accounts[9] }),
        truffleAssert.ErrorType.REVERT
      );
    });


    /////////////////////////////////////////////////////////

    //////////////// Return Limit of Approvals ///////////////
    it('Should return the limit of approvals', async function () {      
      let approvals = await instance.getApprovalsAndLimit(4);
      truffleAssert.eventEmitted(approvals, 'approvalsE', (ev) => {
        return ev.numberOfApprovals.toNumber() === 1 && ev.limit.toNumber() === 2;
      });      
    });
    
    /////////////////////////////////////////////////////////////////////////
    
    ///////////////////////////VOTEU/////////////////////////////////////////////
    it('Standard user should be able to vote on a availabe case', async function () {
      await truffleAssert.passes(
          instance.vote(1, 2, {from: accounts[6]}),
          truffleAssert.ErrorType.REVERT
      )
    });
    it('Admin user should be able to vote on a availabe case', async function () {
      await truffleAssert.passes(
          instance.vote(1, 1, {from: accounts[1]}),
          truffleAssert.ErrorType.REVERT
      )
    });

    it('SuperAdmin user should be able to vote on a availabe case', async function () {
      await truffleAssert.passes(
          instance.vote(1, 1, {from: accounts[9]}),
          truffleAssert.ErrorType.REVERT
      )
    });

    it('Should not allow vote on non-existing alternative (Admin)', async ()=> {
      await truffleAssert.fails(
          instance.vote(1, 4, {from: accounts[1]}),
          truffleAssert.ErrorType.REVERT
      )
    });

    it('Should not allow vote on non-existing alternative (Standard)', async ()=> {
      await truffleAssert.fails(

           instance.vote(1, 4, {from: accounts[6]}),
          truffleAssert.ErrorType.REVERT
      )
    });

    it('Should not allow vote on non-existing alternative (SuperAdmin)', async ()=> {
      await truffleAssert.fails(
          instance.vote(1, 4, {from: accounts[9]}),
          truffleAssert.ErrorType.REVERT
      )
    });

    it("Should not allow standard to vote on case that is not open for voting", async ()=>{
      await truffleAssert.fails(
        instance.vote(4, 1, {from: accounts[6]}),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow admin to vote on case that is not open for voting", async ()=>{
      await truffleAssert.fails(
        instance.vote(4, 1, {from: accounts[1]}),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow superAdmin to vote on case that is not open for voting", async ()=>{
      await truffleAssert.fails(
        instance.vote(4, 1, {from: accounts[9]}),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow standard users to vote on a deactivated case", async()=>{
      await truffleAssert.fails(
          instance.vote(3, 1, {from: accounts[6]}),
          truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow admin users to vote on a deactivated case", async()=>{
      await truffleAssert.fails(
          instance.vote(3, 1, {from: accounts[1]}),
          truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow superAdmin users to vote on a deactivated case", async()=>{
      await truffleAssert.fails(
          instance.vote(3, 1, {from: accounts[9]}),
          truffleAssert.ErrorType.REVERT
      )
    })
          
          /*

    it('Should not vote on a closed case', async function () {
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
      await instance.createCase('First Case', 12312, ['yes', 'no'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;
         await instance.approve(1, { from: accounts[1] });
         await instance.approve(1, { from: accounts[2] });
         await instance.approve(1, { from: accounts[3] });

        await truffleAssert.fails(
          instance.vote(1, 1, { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
        );
    });

    it('Should be able to change vote', async function () {
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['yes', 'no'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

      await instance.approve(1, { from: accounts[1] });
      await instance.approve(1, { from: accounts[2] });
      await instance.approve(1, { from: accounts[3] });
      await instance.vote(1, 1, { from: accounts[1] });
        await truffleAssert.passes(
          instance.vote(1, 2, { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
        );
    });
    //////////////////////////////////////////////////////////////////
    
  

     it('Should get user vote', async function () {
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
      await instance.createUser('Grimstad', 'Standard', { from: accounts[6] });
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[7] });
      await instance.createCase('First Case', Date.now()+30000, ['yes', 'no'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

      await instance.approve(1, { from: accounts[1] });
      await instance.approve(1, { from: accounts[2] });
      await instance.approve(1, { from: accounts[3] });

      await instance.vote(1,1, {from: accounts[1]});

      await truffleAssert.passes(
        instance.getMyVote(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    ///////////////////////////////////////////////////////////////////
    /// Hvis en Admin bruker lager en case og godkjenne den, så blir den open for voting.
    // det burde ikke være mulig??
    it('Only one Admin/SuperAdmin should not be able to create and approve a case ', async function () {
      // First create a user of type Reginal / SuperAdmin
      // Then test createUser
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[2],});
      await truffleAssert.fails(
        instance.approve(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });


    */
    
  });