
const CaseOne = artifacts.require('Case');
const Proxy = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (accounts) {
    let instance;

    beforeEach(async function () {
      const caseOne = await CaseOne.new();
      const proxy = await Proxy.new(caseOne.address);
      //create proxy Case to fool truffle
      instance = await CaseOne.at(proxy.address);
    });
    
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
           instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });


       it('User type National can create a cases', async function () {
     
         await instance.createUser('Grimstad', 'National', { from: accounts[1] });
         await truffleAssert.passes(
           instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });

       it('User type Standard can not create a case', async function () {
       
         await instance.createUser('Grimstad', 'Standard', { from: accounts[1] });
         await truffleAssert.fails(
           instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });

        it('Odd number of Regional/National users can not create a case (2)', async function () {
  
         await instance.createUser('Grimstad', 'Regional', {from: accounts[1] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[2] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[3] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[4] });
         await truffleAssert.fails(
           instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });

       it('Odd number of Regional/National users can not create a case', async function () {
    
         await instance.createUser('Grimstad', 'Regional', {from: accounts[1] });
         await instance.createUser('Grimstad', 'Regional', {from: accounts[2] });
         await truffleAssert.fails(
           instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', { from: accounts[1] }),
           truffleAssert.ErrorType.REVERT
         );
       });
     

       it('Should get a existing case', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
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
        await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
          from: accounts[1],
        });
        await instance.deleteCase(1);
        await truffleAssert.fails(instance.getCase(1),truffleAssert.ErrorType.REVERT
           );
       });
         

        it('Should delete a case', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
          from: accounts[1],
        });
        await truffleAssert.passes(instance.deleteCase(1),truffleAssert.ErrorType.REVERT
           );
       });

     
      it('Should not delete a case that is open for voting', async function () {
        await instance.createUser('Grimstad', 'National', { from: accounts[1] });
        await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
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
      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
        from: accounts[1],
      });

      await truffleAssert.passes(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('National user can approve a case', async function () {
      await instance.createUser('Grimstad', 'National', { from: accounts[1] });
      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
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
      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
        from: accounts[2],
      });

      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('National/Regional should not approve twice', async function () {
      await instance.createUser('Grimstad', 'National', { from: accounts[1] });
      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
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

      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
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
     

    //////////////// Return Limit of Approvals ///////////////
     it('Should return the limit of approvals', async function () {
       await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
       await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
           from: accounts[1],
         }),
         truffleAssert.ErrorType.REVERT
       let result = await instance.returnLimitApproval(1);
       assert(result.toNumber() === 3);
     });
     //////////////////////////////////////////////////////////

     ////////////// Return total votes //////////////////////
      it('Should return number of total votes', async function () {
       await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[6] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[7] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[8] });
       await instance.createUser('Grimstad', 'Standard', { from: accounts[9] });
       await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
           from: accounts[1],
         }),
         truffleAssert.ErrorType.REVERT
       let result = await instance.returnTotalVotes(1);
       assert(result.toNumber() === 9);
     });
     ///////////////////////////////////////////////////////
     

    ////////// Get number of approvals on the case ///////////
      it('Should return the limit of approvals', async function () {
       await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
       await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
       await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
           from: accounts[1],
         }),
         truffleAssert.ErrorType.REVERT
      
      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });


       let result = await instance.getApprovalZ(1);
       assert(result.toNumber() === 3);
     });
    //////////////////////////////////////////////////////////


    ///////////////////// getWaitinglistCountZ ////////////////
    it('Should return number of cases wating to be approved', async function () {
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;
      await instance.createCase('Second Case', 20052022, ['Ja', 'Nei'], {
        from: accounts[2],
      }),
        truffleAssert.ErrorType.REVERT;
      await instance.createCase('Thrid Case', 20052023, ['Ja', 'Nei'], {
        from: accounts[3],
      }),
        truffleAssert.ErrorType.REVERT;

      let result = await instance.getWaitinglistCountZ();
      assert(result.length === 3);
    });
    
    /////////////////////////////////////////////////////////////////////////
   
    ///////////////////// Vote ///////////////////////////////////////
      it('All user type should be able to vote on a availabe case', async function () {
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createUser('Grimstad', 'Standard', { from: accounts[6] });
      await instance.createUser('Grimstad', 'National', { from: accounts[7] });
      await instance.createCase('First Case', Date.now()+30000, ['Ja', 'Nei'], {
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
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['Ja', 'Nei'], {
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
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['Ja', 'Nei'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

        await truffleAssert.fails(
          instance.vote(1, 1, { from: accounts[1] }),
          truffleAssert.ErrorType.REVERT
        );
    });

    it('Should not vote on a closed case', async function () {
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createCase('First Case', 12312, ['Ja', 'Nei'], {
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
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['Ja', 'Nei'], {
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
    
   //////////////// Get Allternatives /////////////////////////////////
      it('Should return case^s alternatives' , async function () {
       await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
       await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
           from: accounts[1],
         }),
         truffleAssert.ErrorType.REVERT
       let result = await instance.getAlternatives(1);
       assert(result._alter[1] === "Ja" & result._alter[2] === "Nei")
     });

     it('Should not return case^s alternatives for non-existing case' , async function () {
       await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
        await truffleAssert.fails(
          instance.getAlternatives(1),
          truffleAssert.ErrorType.REVERT
        );
     });

     it('Should return alternatives with voted number', async function () {
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createCase('First Case', Date.now()+30000, ['Ja', 'Nei'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });

     await instance.vote(1, 1, { from: accounts[1] });
     let result = await instance.getAlternatives(1);
     assert(result._alterNum[1].toNumber() === 1 & result._alterNum[2].toNumber() == 0)
    });

     it('Should get user vote', async function () {
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[2] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[3] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[4] });
      await instance.createUser('Grimstad', 'Regional', { from: accounts[5] });
      await instance.createUser('Grimstad', 'Standard', { from: accounts[6] });
      await instance.createUser('Grimstad', 'National', { from: accounts[7] });
      await instance.createCase('First Case', Date.now()+30000, ['Ja', 'Nei'], {
        from: accounts[1],
      }),
        truffleAssert.ErrorType.REVERT;

      await instance.approvalZ(1, { from: accounts[1] });
      await instance.approvalZ(1, { from: accounts[2] });
      await instance.approvalZ(1, { from: accounts[3] });

      await instance.vote(1,1, {from: accounts[1]});

      await truffleAssert.passes(
        instance.getMyVote(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });

    ///////////////////////////////////////////////////////////////////
    /// Hvis en Regional bruker lager en case og godkjenne den, så blir den open for voting.
    // det burde ikke være mulig??
    it('Only one Regional/National should not be able to create and approve a case ', async function () {
      // First create a user of type Reginal / National
      // Then test createUser
      await instance.createUser('Grimstad', 'Regional', { from: accounts[1] });
      await instance.createCase('First Case','Descripton', 20202020, 20202020,'ja','nei','kanskje','blank', 'slutt å spørre', {
        from: accounts[1],
      });
      await truffleAssert.fails(
        instance.approvalZ(1, { from: accounts[1] }),
        truffleAssert.ErrorType.REVERT
      );
    });
  });