
const CaseOne = artifacts.require('Case');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {
    let instance;

    //
    //  The deployment contract creates 3x SuperAdmin, two as input and one as msg.sender !!!
    //

    // beforeEach(async function () {
    it('Should get the deployed case, and point caseOne to proxys address', async function () {
      let proxyCase = await Proxey.deployed();
      instance = await CaseOne.at(proxyCase.address);
    });

    // it('Should return 3 users of superAdmin', async function () {
    //   let value = await instance.usersOfType('SuperAdmin', { from: accounts[0] })
    //   console.log("SuperAdmin: "+value);
    //   assert(value == 3, "not 3 of the type SuperAdmin");
      
    // });

    // it('Should return 0 users of Admin', async function () {
    //   let value = await instance.usersOfType('Admin', { from: accounts[0] })
    //   console.log("Admin: "+value);
    //   assert(value == 0, "not 0 of the type Admin");
      
    // });
   
    
    //////////////////Create User//////////////////////////
    it('Should create a user of any type', async function () {
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Admin', { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT);
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Admin', { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT);
       await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[2] }),
        truffleAssert.ErrorType.REVERT
       );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Admin', { from: accounts[3] }),
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
    });
    
    it('Should be able to change userType and Region on account', async function () {
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'Standard', { from: accounts[6] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[7] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[8] }),
        truffleAssert.ErrorType.REVERT
      );
      await truffleAssert.passes(
        instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[9] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    // it('Should return 7 users of superAdmin', async function () {
    //   let value = await instance.usersOfType('Admin', { from: accounts[0] })
    //   console.log(value);
    //   assert(value == 7, "not 7 of the type Admin");
      
    // });

    it('Should not be able to change userType or Region on account to the same', async function () {
      await truffleAssert.fails(
        instance.createUser('Grimstad', 'Admin', { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });
        
    
    ////////////////////////////////////////////////////////

      // ////////////// Get User Array Length ///////////////////
      // it('Should get user array length', async function () {
      //   await  instance.createUser('Grimstad', 'Admin', { from: accounts[1] })
      //   let result = await instance.getUserArrayLength('Grimstad', 'Admin');
      //   assert(result.toNumber() === 1, "Length not set corecctly");
      // });

      // ////////////////////////////////////////////////////////
      
      
      ///////////////// Create Case //////////////////////////
      
    it('UserType Admin can create cases', async function () {
      // let value = await instance.usersOfType('Admin', { from: accounts[0] })
      // console.log("Admin: "+value);
      // assert(value == 3, "not 4 of the type Admin");
        // Then test createCase
        await truffleAssert.passes(
          instance.createCase('First Case', 'Descripton',
          Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
          'yes', 'no', { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
          );
        });
        
        
    it('UserType SuperAdmin can create a cases', async function () {
      // let value = await instance.usersOfType('SuperAdmin', { from: accounts[0] })
      // console.log("SuperAdmin: "+value);
          await truffleAssert.passes(
            instance. createCase('First Case', 'Descripton',
            Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
            'yes', 'no', { from: accounts[9] }),
            truffleAssert.ErrorType.REVERT
            );
    });
          
    it('User type Standard can NOT create a case', async function () {
            await truffleAssert.fails(
              instance. createCase('First Case', 'Descripton',
              Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
              'yes', 'no', { from: accounts[2] }),
              truffleAssert.ErrorType.REVERT
              );
    });

            
    it('Even number of Admin users can NOT create a case', async function () {
      // let value = await instance.usersOfType('Admin', { from: accounts[5] })
      // console.log("Admin: " + value);
      instance.createUser('Grimstad', 'Admin', { from: accounts[5] })
         await truffleAssert.fails(
           instance. createCase('First Case', 'Descripton',
             Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
             'yes', 'no', { from: accounts[5] }),
           truffleAssert.ErrorType.REVERT
         );
    });
    

    it('Even number of SuperAdmin users can NOT create a case', async function () {
        let value = await instance.usersOfType('Admin', { from: accounts[5] })
      console.log("Admin: " + value);
         await instance.createUser('Grimstad', 'SuperAdmin', {from: accounts[5] });
        //  await instance.createUser('Grimstad', 'Admin', {from: accounts[2] });
         await truffleAssert.fails(
           instance. createCase('First Case', 'Descripton',
             Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
             'yes', 'no', { from: accounts[9] }),
           truffleAssert.ErrorType.REVERT
         );
      await instance.createUser('Grimstad', 'Standard', { from: accounts[5] }); // reverts back to a standard
      value = await instance.usersOfType('SuperAdmin', { from: accounts[5] })
      console.log("Admin: " + value);
    });
    

     

    //    it('Should get a existing case', async function () {
    //     await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
    //      await instance.createCase('First Case', 'Descripton',
    //        Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
    //        'yes', 'no', {from: accounts[1],});
    //     let result = await instance.getCase(1);
    //     assert(result._title == 'First Case');
    // });
     
      //  it('Should not get a non-existent case', async function () {
      //   await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
      //   await truffleAssert.fails(instance.getCase(1),truffleAssert.ErrorType.REVERT);
      //  });
      
      //   it('Should not get case when it is deactivated', async function () {
      //   await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
      //   await instance.createCase('First Case', 'Descripton',
      //      Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
      //      'yes', 'no', {from: accounts[1],});
      //   await instance.deleteCase(1);
      //   await truffleAssert.fails(instance.getCase(1),truffleAssert.ErrorType.REVERT
      //      );
      //  });
         

        it('Should delete a case', async function () {

        await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[9],});
        await truffleAssert.passes(instance.deleteCase(1),truffleAssert.ErrorType.REVERT
           );
       });

     
      it('Should not delete a case that is open for voting', async function () {
        await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
        await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[1],});
        await instance.approvalZ(1, { from: accounts[1] });
        await truffleAssert.fails(instance.deleteCase(1),truffleAssert.ErrorType.REVERT
           );
       });
        
            /*

    /////////////////////////////////////////////////////////
    //////////////////////////// ApprovalZ /////////////////////////

    it('Admin user can approve a case', async function () {
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[1],});

      await truffleAssert.passes(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('SuperAdmin user can approve a case', async function () {
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
      await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[1],});

      await truffleAssert.passes(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('Standard user can not approve a case', async function () {
      await instance.createUser('Grimstad', 'Standard', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
      await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[2],});

      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('SuperAdmin/Admin should not approve twice', async function () {
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
      await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[2],});
      await instance.approvalZ(1, { from: accounts[1] });
      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('SuperAdmin/Admin user should not approve an approved case', async function () {
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[1] });
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[2] });
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[3] });
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[4] });
      await instance.createUser('Grimstad', 'SuperAdmin', { from: accounts[5] });

      await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[2],});

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });

      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[4] }),
        truffleAssert.ErrorType.REVERT
      );
    });
    /////////////////////////////////////////////////////////
     

    //////////////// Return Limit of Approvals ///////////////
     it('Should return the limit of approvals', async function () {
       await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
       await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[1],}),
         truffleAssert.ErrorType.REVERT
       let result = await instance.returnLimitApproval(1);
       assert(result.toNumber() === 3);
     });
     //////////////////////////////////////////////////////////

     ////////////// Return total votes //////////////////////
      it('Should return number of total votes', async function () {
       await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
       await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[6] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[7] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[8] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[9] });
       await instance.createCase('First Case', 'Descripton',
           Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
           'yes', 'no', {from: accounts[1],}),
         truffleAssert.ErrorType.REVERT
       let result = await instance.returnTotalVotes(1);
       assert(result.toNumber() === 9);
     });
     ///////////////////////////////////////////////////////
     

    ////////// Get number of approvals on the case ///////////
    //   it('Should return the limit of approvals', async function () {
    //    await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
    //    await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
    //    await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
    //    await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
    //    await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
    //    await instance.createCase('First Case', 'Descripton',
    //        Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
    //        'yes', 'no', {from: accounts[1],}),
    //      truffleAssert.ErrorType.REVERT
      
    //   await instance.approvalZ(1, { from: accounts[1] });
    //   await instance.approvalZ(1, { from: accounts[2] });
    //   await instance.approvalZ(1, { from: accounts[3] });


    //    let result = await instance.getApprovals(1);
    //    assert(result.toNumber() === 3);
    //  });
    //////////////////////////////////////////////////////////


    ///////////////////// getWaitinglistCountZ ////////////////
    // it('Should return number of cases wating to be approved', async function () {
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
    //   await instance.createCase('First Case', 'Descripton',
    //        Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
    //        'yes', 'no', {from: accounts[1],}),
    //     truffleAssert.ErrorType.REVERT;
    //   await instance.createCase('Second Case', 20052022, ['yes', 'no'], {
    //     from: accounts[2],
    //   }),
    //     truffleAssert.ErrorType.REVERT;
    //   await instance.createCase('Thrid Case', 20052023, ['yes', 'no'], {
    //     from: accounts[3],
    //   }),
    //     truffleAssert.ErrorType.REVERT;

    //   let result = await instance.getWaitinglistCountZ();
    //   assert(result.length === 3);
    // });
    
    /////////////////////////////////////////////////////////////////////////
   
    ///////////////////// Vote ///////////////////////////////////////
      it('All user type should be able to vote on a availabe case', async function () {
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

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });

        await truffleAssert.passes(
          instance.vote(1, 1, {from: accounts[1]} ),
          truffleAssert.ErrorType.REVERT
        );
        await truffleAssert.passes(
          instance.vote(1, 1, { from: accounts[6] }),
          truffleAssert.ErrorType.REVERT
        );
        await truffleAssert.passes(
          instance.vote(1, 1, { from: accounts[7] }),
          truffleAssert.ErrorType.REVERT
        );
    });
     it('Should not vote on non-exsited option', async function () {
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['yes', 'no'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });

        await truffleAssert.fails(
          instance.vote(1, 4, { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
        );
    });
     it('Should not vote on a case that it not open yet for voting', async function () {
      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['yes', 'no'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

        await truffleAssert.fails(
          instance.vote(1, 1, { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
        );
    });

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
         await instance.approvalZ(1, { from: accounts[1] });
         await instance.approvalZ(1, { from: accounts[2] });
         await instance.approvalZ(1, { from: accounts[3] });

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

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });
      await instance.vote(1, 1, { from: accounts[1] });
        await truffleAssert.passes(
          instance.vote(1, 2, { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
        );
    });
    //////////////////////////////////////////////////////////////////
    
  //  //////////////// Get Allternatives /////////////////////////////////
  //     it('Should return case^s alternatives' , async function () {
  //      await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
  //      await instance.createCase('First Case', 'Descripton',
  //          Math.round(new Date() / 1000) + 1, Math.round(new Date() / 1000) + 60 * 60,
  //          'yes', 'no', {from: accounts[1],}),
  //        truffleAssert.ErrorType.REVERT
  //      let result = await instance.getAlternatives(1);
  //      assert(result._alter[1] === "yes" & result._alter[2] === "no")
  //    });

    //  it('Should not return case^s alternatives for non-existing case' , async function () {
    //    await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
    //     await truffleAssert.fails(
    //       instance.getAlternatives(1),
    //       truffleAssert.ErrorType.REVERT
    //     );
    //  });

    //  it('Should return alternatives with voted number', async function () {
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[1] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[2] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[3] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[4] });
    //   await instance.createUser('Grimstad', 'Admin', { from: accounts[5] });
    //   await instance.createCase('First Case', Date.now()+30000, ['yes', 'no'], {from: accounts[1],
    //   }),
    //     truffleAssert.ErrorType.REVERT;

    //   await instance.approvalZ(1, { from: accounts[1] });
    //   await instance.approvalZ(1, { from: accounts[2] });
    //   await instance.approvalZ(1, { from: accounts[3] });

    //  await instance.vote(1, 1, { from: accounts[1] });
    //  let result = await instance.getAlternatives(1);
    //  assert(result._alterNum[1].toNumber() === 1 & result._alterNum[2].toNumber() == 0)
    // });

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