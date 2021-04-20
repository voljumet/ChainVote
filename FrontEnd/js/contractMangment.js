Moralis.initialize('2xY2tmcdYBf3IdqY5Yuo74fSEyxigYSADL9Ywtrj'); // Application id from moralis.io
Moralis.serverURL = 'https://rnonp7vwlz3d.moralis.io:2053/server'; //Server url from moralis.io

function pauseContract() {
  hideElment(PauseButton);
  showElment(UnpauseButton);
   alert('Did you want to pause the contract!');
}
function unPauseContract() {
  showElment(PauseButton);
  hideElment(UnpauseButton);
  alert('Did you want to pause the contract!');
}

async function checkUserType() {
  hideElment(UnpauseButton)
  user = await Moralis.User.current();
  if (!user) {
    alert('Please Log in');
    location.href = 'login.html' + location.hash;
  }
  if (user.get('UserType') != 'SuperAdmin') {
    location.href = 'accessDenied.html';
  }
}

const PauseButton = document.getElementById('pause-button');
PauseButton.onclick = pauseContract;
const UnpauseButton = document.getElementById('unpause-button');
UnpauseButton.onclick = unPauseContract;
hideElment = (element) => (element.style.display = 'none');
showElment = (element) => (element.style.display = 'block');

checkUserType();
