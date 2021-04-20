Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

async function pauseContract() {
  alert('Did you want to pause the contract!');

  window.web3 = await Moralis.Web3.enable();
  let abi = await getProxyAbi();
  let contractInstance = new web3.eth.Contract(abi, contractAddress);
  contractInstance.methods
    .pause()
    .send({ from: ethereum.selectedAddress })
    .on('receipt', async function (receipt) {
      if (receipt) {
        console.log(receipt);
      }
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
      .on('receipt', async function (receipt) {
        if (receipt) {
          let result = document.getElementById('h2');
          let num = receipt.events.caseApprovedE.returnValues.caseNumber;
          result.innerText = 'Approvals: ' + num;
          console.log(receipt);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

async function checkUserType() {
  var date = new Date();
  WaitAWeek(date);
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

const PauseButton = document.getElementById('pause-button');
PauseButton.onclick = pauseContract;
const UnpauseButton = document.getElementById('unpause-button');
UnpauseButton.onclick = unPauseContract;
const ApprovePause = document.getElementById('approve-pause-button');
ApprovePause.onclick = approvePause;
hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

checkUserType();


function WaitAWeek(date){
// Set the date we're counting down to

date.setDate(date.getDate()+7)
var countDownDate = new Date(date).getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);
}
