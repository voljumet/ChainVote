const CaseOne = artifacts.require('Case');
const CaseTwo = artifacts.require('CaseTwo');
const Proxey = artifacts.require('Proxy');
const truffleAssert = require('truffle-assertions');

  contract('Proxy', async function (deployer, accounts) {
    let instance;
    let instance2;
    let instance3;

    await deployer.deploy(CaseTwo, {from: accounts[4]});

    beforeEach(async function () {
      let proxey = await Proxey.deployed();
      await CaseOne.deployed();
      await CaseTwo.deployed();
      //create proxy Case to fool truffle
      
      instance = await CaseOne.at(proxey.address);
      instance2 = await CaseTwo.at(proxey.address);
      instance3 = await Proxey.at(proxey.address);
    });

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /////////////////////////Create users//////////////////////////////////////////
  
    it("Should be possible to access case functionality as standard user", async()=>{
      await truffleAssert.passes(
        instance.createUser("Grimstad", "Standard", {from: accounts[5]}),
        truffleAssert.ErrorType.REVERT
      )})
    
      it("Should be possible to create admin user", async()=>{
        await truffleAssert.passes(
          instance.createUser("Grimstad", "Admin", {from: accounts[6]}),
          truffleAssert.ErrorType.REVERT
      )})

      /////////////////////////Pause functionality//////////////////////////////////////////

      it("Should not allow standard users to pause contract", async ()=>{
        await truffleAssert.fails(
          instance3.pause({from: accounts[5]}),
          truffleAssert.ErrorType.REVERT
        )
      })

      it("Should not allow admins to pause contract", async ()=>{
          await truffleAssert.fails(
            instance3.pause({from: accounts[6]}),
            truffleAssert.ErrorType.REVERT
          )
        })
      
      it("Should not run upgrade function when not paused", async()=>{
        await truffleAssert.fails(
          instance3.upgrade(instance2.address,{from: accounts[9]}),
          truffleAssert.ErrorType.REVERT
        )
      })
    
      it("Should allow superadmins to pause contract", async ()=>{
          let pause = await instance3.pause({from: accounts[7]})
          await truffleAssert.eventEmitted(pause, 'caseApprovedE', (ev) => {
          return ev.title === "New pause or Upgrade request";
      })})

      it("Should not allow standard users to sing multisig instance", async ()=>{
        await truffleAssert.fails(
          instance3.signMultisigInstance({from: accounts[5]}),
          truffleAssert.ErrorType.REVERT
        )
      })

      it("Should not allow admins to sign multisig instance", async ()=>{
        await truffleAssert.fails(
          instance3.signMultisigInstance({from: accounts[6]}),
          truffleAssert.ErrorType.REVERT
        )
      })

     it("Should allow superadmins to sign multisig instance", async ()=>{
        let sign = await instance3.signMultisigInstance({from: accounts[8]})
        await truffleAssert.eventEmitted(sign, 'caseApprovedE', (ev) =>{
          return ev.title === "Signed request";
        })
     })

     it("Should pause contract when enough signatures is given", async ()=>{
      await instance3.signMultisigInstance({from: accounts[9]})
      let paused = await instance3.pause({from: accounts[9]})
      await truffleAssert.eventEmitted(paused, 'confirmationE', (ev) => {
        return ev.confirmation === true; 
      })
     })

    /////////////////////////Upgrade functionality//////////////////////////////////////////
     it("Should not allow standard users to upgrade contract", async ()=>{
      await truffleAssert.fails(
        instance3.upgrade(instance2.address,{from: accounts[5]}),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow admins to upgrade contract", async ()=>{
      await truffleAssert.fails(
        instance3.upgrade(instance2.address,{from: accounts[6]}),
        truffleAssert.ErrorType.REVERT
      )
    })

     it("Should allow superAdmins to upgrade contract", async ()=>{
        let upgrade = await instance3.upgrade(instance2.address, {from: accounts[9]})
        await truffleAssert.eventEmitted(upgrade, 'caseApprovedE', (ev) =>{
          return ev.title === "New pause or Upgrade request";
        })
     })

     it("Should allow superAdmins to sign upgrade request", async () =>{
       let signupgrade = await instance3.signMultisigInstance({from: accounts[8]})
       await truffleAssert.eventEmitted(signupgrade, 'caseApprovedE', (ev)=>{
         return ev.title === "Signed request";
       })
     })

     it("Should change contract address when enough signatures are given", async()=>{
      await instance3.signMultisigInstance({from: accounts[7]})
      let upgrade = await instance3.upgrade(CaseTwo.address, {from: accounts[7]})
      await truffleAssert.eventEmitted(upgrade, 'confirmationE', (ev)=>{
        return ev.confirmation === true;
      })
     })

     /////////////////////////Unpause functionality//////////////////////////////////////////
     it("Should not allow standard users to unpause contract", async ()=>{
      await timeout(3000)
      await truffleAssert.fails(
        instance3.unPause({from: accounts[5]}),
        truffleAssert.ErrorType.REVERT
      )
    })

    it("Should not allow admins to unpause contract", async ()=>{
      await timeout(3000)
      await truffleAssert.fails(
        instance3.unPause({from: accounts[6]}),
        truffleAssert.ErrorType.REVERT
      )
    })

     it("Should allow superadmins to unpause the contract", async()=>{
      await timeout(3000)
      let unpause = await instance3.unPause({from: accounts[9]})
      await truffleAssert.eventEmitted(unpause, 'confirmationE', (ev)=>{
        return ev.confirmation === true;
      })
    })

    /////////////////////////Upgraded contract functionality//////////////////////////////////////////

    it('Should fail to call old functions no longer in new contract', async function () {
      await truffleAssert.fails(
       instance.createUser('Grimstad', 'Standard', { from: accounts[2] }),
       truffleAssert.ErrorType.REVERT);
      })

     it("Should be possible to access functionality in casetwo after upgrade", async()=>{
         await truffleAssert.passes(
          await instance2.verifyNewCase({from: accounts[9]}),
          truffleAssert.ErrorType.REVERT
         )
     })
  })
