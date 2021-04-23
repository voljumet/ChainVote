

async function updateMoralis(_PauseStarted, _UpgradeStarted, _InstanceInProgress, _ApprovalsNeeded) {
  let reuslt = await Moralis.Cloud.run('ContractManager2', {});
 
  reuslt.forEach((element) => {
    console.log("el: " +element.attributes.PauseStarted);
    if (element.id == "skUzkrXWu4") ID = element.id;
    
    else("No Match found")
  });
  const contractManager = Moralis.Object.extend('ContractManager2');
  const newContrctManager = new contractManager();

  console.log(_PauseStarted,_UpgradeStarted, _InstanceInProgress)
  newContrctManager.set('objectId', "skUzkrXWu4");
  await newContrctManager.save().then((el)=>{
    el.set('PauseStarted', _PauseStarted);
    el.set('UpgradeStarted', _UpgradeStarted);
    el.set('InstanceInProgress', _InstanceInProgress);
    el.set('ApprovalsNeeded', _ApprovalsNeeded);
    return  el.save()
  });
  alert("Moralis Updated");
  
}

async function updateMoralis2(_paused, _pauseTimer, _functionContractAddress) {
  let reuslt = await Moralis.Cloud.run('ContractManager2', {});
 
  reuslt.forEach((element) => {
    console.log("el: " +element.attributes.PauseStarted);
    if (element.id == "skUzkrXWu4") ID = element.id;
    
    else("No Match found")
  });
  const contractManager = Moralis.Object.extend('ContractManager2');
  const newContrctManager = new contractManager();

  newContrctManager.set('objectId', "skUzkrXWu4");
  await newContrctManager.save().then((el)=>{
    el.set('paused', _paused);
    el.set('pauseTimer', _pauseTimer);
    el.set('functionContractAddress', _functionContractAddress);
    return  el.save()
  });

  alert("Moralis Updated 2");
  
}



async function buttonsDisplayManager(){
  let show = document.getElementById('showApprovalsNeeded');
  let PauseStarted, UpgradeStarted , InstanceInProgress , ApprovalsNeeded,
  Paused, PauseTimer;

  let reuslt = await Moralis.Cloud.run('ContractManager2', {});
  reuslt.forEach((element) => {
    if (element.id == "skUzkrXWu4"){
      console.log("el: " +element);
      PauseStarted = element.attributes.PauseStarted;
      UpgradeStarted = element.attributes.UpgradeStarted;
      InstanceInProgress = element.attributes.InstanceInProgress;
      ApprovalsNeeded = element.attributes.ApprovalsNeeded;
      Paused = element.attributes.paused;
      PauseTimer = element.attributes.pauseTimer;
      console.log("PauseStarted: "+ PauseStarted,"UpgradeStarted: " + UpgradeStarted , "InstanceInProgress: "+ InstanceInProgress
      ,"ApprovalsNeeded: "+ ApprovalsNeeded, "Paused:" + Paused, "PauseTimer: "+ PauseTimer);

    }
    else{
      alert("No Match found on Moralis")
    }
  });

  
    if (Paused && !PauseStarted && !UpgradeStarted) {
      // show "Pause contract"
      showElment(inputField)
      showElment(UnpauseButton)
      showElment(UpgradeButton);
      
    
  } else {
    if (InstanceInProgress) {
      show.innerText =
      'ApprovalsNeeded:'+ ApprovalsNeeded 
     
      if (PauseStarted) {
        // show "Approve pause contract"
        showElment(ApprovePause);
      }
      if (UpgradeStarted) {
        // show "Approve contract upgrade"
        showElment(ApproveUppgrade);
      }
    } else {
      // show "Unpause"
      showElment(PauseButton);
    }
  }

}

async function pauseContract() {
  alert('Did you want to pause the contract!');

  window.web3 = await Moralis.Web3.enable();
  let abi = await getProxyAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .pause()
    .send({ from: ethereum.selectedAddress })
    .on('receipt', async function (receipt) {
      let PauseStarted = receipt.events.caseApprovedE.returnValues.pauseStarted;
      let UpgradeStarted = receipt.events.caseApprovedE.returnValues.upgradeStarted;
      let InstanceInProgress = receipt.events.caseApprovedE.returnValues.instanceInProgress;
      let ApprovalsNeeded = receipt.events.caseApprovedE.returnValues.approvalsNeeded;

      updateMoralis(PauseStarted,UpgradeStarted,InstanceInProgress,ApprovalsNeeded);
      console.log(receipt);
    });
}

async function upgradContract(_newAddress){
  window.web3 = await Moralis.Web3.enable();
  let abi = await getProxyAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .upgrade(_newAddress)
    .send({ from: ethereum.selectedAddress })
    .on('receipt', async function (receipt) {
      let PauseStarted = receipt.events.caseApprovedE.returnValues.pauseStarted;
      let UpgradeStarted = receipt.events.caseApprovedE.returnValues.upgradeStarted;
      let InstanceInProgress = receipt.events.caseApprovedE.returnValues.instanceInProgress;
      let ApprovalsNeeded = receipt.events.caseApprovedE.returnValues.approvalsNeeded;

      updateMoralis(PauseStarted,UpgradeStarted,InstanceInProgress,ApprovalsNeeded);
      console.log(receipt);
    });

}

async function unPauseContract() {
  try {
    alert('Did you want to Unpause the contract!');
    window.web3 = await Moralis.Web3.enable();
    let abi = await getProxyAbi();
    let contractInstance = new web3.eth.Contract(abi, contractAddress);
    contractInstance.methods
      .unPause()
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {
        if (receipt) {
          console.log(receipt);
        }
      });
  } catch (error) {
    console.log(error);
  }
}
async function approvePause() {
  try {
    alert('Did you want to Unpause the contract!');
    window.web3 = await Moralis.Web3.enable();
    let abi = await getMultiAbi();
    let contractInstance = new web3.eth.Contract(abi, contractAddress);
    contractInstance.methods
      .signMultisigInstance()
      .send({ from: ethereum.selectedAddress })
      .on('receipt', async function (receipt) {console.log("approve: "+ receipt)
        if (receipt.events.caseApprovedE != null) {
          let PauseStarted = receipt.events.caseApprovedE.returnValues.pauseStarted;
          let UpgradeStarted = receipt.events.caseApprovedE.returnValues.upgradeStarted;
          let InstanceInProgress = receipt.events.caseApprovedE.returnValues.instanceInProgress;
          let ApprovalsNeeded = receipt.events.caseApprovedE.returnValues.approvalsNeeded;
          updateMoralis(PauseStarted,UpgradeStarted,InstanceInProgress,ApprovalsNeeded);

        }if(receipt.events.confirmationE != null){

          let Paused = receipt.events.confirmationE.returnValues.paused;
          let PausedTimer = receipt.events.confirmationE.returnValues.pauseTimer;
          let FunctionContractAddress = receipt.events.confirmationE.returnValues.functionContractAddress;
          updateMoralis2(Paused,PausedTimer,FunctionContractAddress);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

async function checkUserType() {
  //WaitAWeek(date);
  //hideElment(UnpauseButton);
  user = await Moralis.User.current();
  if (!user) {
    alert('Please Log in');
    location.href = 'login.html' + location.hash;
  }
  if (user.get('UserType') != 'SuperAdmin') {
    location.href = 'accessDenied.html';
  }
}
Moralis.Web3.onAccountsChanged(function (accounts) {
  // window.location.replace("http://www.w3schools.com");
  location.hash = 'runLogOut';
  location.href = 'login.html' + location.hash;
});

const UpgradeButton = document.getElementById('upgrade-button');
UpgradeButton.onclick  = function () {
  upgradContract(
    document.getElementById("upgrade_input_field").value
  );
};
const ApproveUppgrade = document.getElementById('approveUpgrade');

const PauseButton = document.getElementById('pause-button');
PauseButton.onclick = pauseContract;
const UnpauseButton = document.getElementById('unpause-button');
UnpauseButton.onclick = unPauseContract;
const ApprovePause = document.getElementById('approve-pause-button');
ApprovePause.onclick = approvePause;

ApproveUppgrade.onclick = approvePause;

const inputField = document.getElementById("upgrade_input_field");

let showCuurentAddrss = document.getElementById('Current_Address');



hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');


checkUserType();

function WaitAWeek(date) {
  // Set the date we're counting down to

  date.setDate(date.getDate() + 7);
  var countDownDate = new Date(date).getTime();

  // Update the count down every 1 second
  var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById('demo').innerHTML =
      days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById('demo').innerHTML = 'EXPIRED';
    }
  }, 1000);
}

buttonsDisplayManager()
